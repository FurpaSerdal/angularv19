const ts = require('typescript');
const path = require('path');

const projectPath = path.resolve(process.cwd(), 'tsconfig.app.json');
const configFile = ts.readConfigFile(projectPath, ts.sys.readFile);
if (configFile.error) {
  throw new Error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'));
}

const parsed = ts.parseJsonConfigFileContent(
  configFile.config,
  ts.sys,
  path.dirname(projectPath)
);

const files = parsed.fileNames.filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts'));

const host = {
  getScriptFileNames: () => files,
  getScriptVersion: () => '1',
  getScriptSnapshot: (fileName) => {
    if (!ts.sys.fileExists(fileName)) return undefined;
    return ts.ScriptSnapshot.fromString(ts.sys.readFile(fileName) || '');
  },
  getCurrentDirectory: () => process.cwd(),
  getCompilationSettings: () => parsed.options,
  getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
  fileExists: ts.sys.fileExists,
  readFile: ts.sys.readFile,
  readDirectory: ts.sys.readDirectory,
  directoryExists: ts.sys.directoryExists,
  getDirectories: ts.sys.getDirectories,
};

const languageService = ts.createLanguageService(host, ts.createDocumentRegistry());

let changedFiles = 0;
for (const fileName of files) {
  const changes = languageService.organizeImports(
    { type: 'file', fileName },
    {},
    {}
  );

  if (!changes || changes.length === 0) continue;

  let content = ts.sys.readFile(fileName) || '';
  const textChanges = changes.flatMap((c) => c.textChanges).sort((a, b) => b.span.start - a.span.start);

  let changed = false;
  for (const change of textChanges) {
    const before = content;
    content =
      content.slice(0, change.span.start) +
      change.newText +
      content.slice(change.span.start + change.span.length);
    if (content !== before) changed = true;
  }

  if (changed) {
    ts.sys.writeFile(fileName, content);
    changedFiles++;
  }
}

console.log(`Organize imports completed. Changed files: ${changedFiles}`);
