import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { auditUrl } from './commands/audit.js';
import { generateCommand } from './commands/generate.js';

const program = new Command();

program
  .name('agent-seo')
  .description('AI SEO toolkit — make your website AI-readable')
  .version('1.0.0');

program
  .command('audit <url>')
  .description('Audit a URL for AI visibility and get an AI Visibility Score (0-100)')
  .option('--json', 'Output as JSON')
  .action(async (url: string, opts: { json?: boolean }) => {
    const spinner = ora(`Fetching ${url}...`).start();

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'agent-seo-audit/1.0',
          'Accept': 'text/html',
        },
      });

      if (!response.ok) {
        spinner.fail(`HTTP ${response.status} ${response.statusText}`);
        process.exit(1);
      }

      const html = await response.text();
      spinner.text = 'Analyzing...';

      const result = await auditUrl(url, html);
      spinner.stop();

      if (opts.json) {
        console.log(JSON.stringify(result, null, 2));
        return;
      }

      // Pretty print
      console.log();
      console.log(chalk.bold('AI Visibility Audit'));
      console.log(chalk.gray(`URL: ${url}`));
      console.log();

      const scoreColor =
        result.score >= 80 ? chalk.green :
        result.score >= 50 ? chalk.yellow :
        chalk.red;
      console.log(`  Score: ${scoreColor(chalk.bold(`${result.score}/100`))}`);
      console.log(`  Markdown tokens: ${chalk.cyan(String(result.transformResult.tokenEstimate))}`);
      console.log();

      for (const check of result.checks) {
        const icon = check.passed ? chalk.green('✓') : chalk.red('✗');
        const scoreStr = chalk.gray(`(${check.score}/${check.maxScore})`);
        console.log(`  ${icon} ${check.name} ${scoreStr}`);
        console.log(`    ${chalk.gray(check.message)}`);
      }

      console.log();
      if (result.score < 50) {
        console.log(chalk.red('Low AI visibility. Install @agent-seo/express or @agent-seo/next to improve.'));
      } else if (result.score < 80) {
        console.log(chalk.yellow('Decent AI visibility. Check the recommendations above to improve.'));
      } else {
        console.log(chalk.green('Excellent AI visibility!'));
      }
    } catch (err) {
      spinner.fail(`Failed: ${(err as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('generate')
  .description('Generate llms.txt and llms-full.txt from a directory of HTML files')
  .requiredOption('--site-name <name>', 'Site name')
  .requiredOption('--site-description <desc>', 'Site description')
  .requiredOption('--base-url <url>', 'Base URL of the site')
  .option('--dir <path>', 'Directory to scan for HTML files', '.')
  .option('--out <path>', 'Output directory', 'public')
  .action(async (opts: { siteName: string; siteDescription: string; baseUrl: string; dir: string; out: string }) => {
    const spinner = ora('Scanning for HTML files...').start();

    try {
      const result = await generateCommand({
        dir: opts.dir,
        out: opts.out,
        siteName: opts.siteName,
        siteDescription: opts.siteDescription,
        baseUrl: opts.baseUrl,
      });

      spinner.succeed(`Generated llms.txt with ${result.routeCount} routes in ${opts.out}/`);
    } catch (err) {
      spinner.fail(`Failed: ${(err as Error).message}`);
      process.exit(1);
    }
  });

program.parse();
