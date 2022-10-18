import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand( 'extension.copyWithoutIndent', async () => {

		const editor = vscode.window.activeTextEditor;
		if (!editor) return;

		if (editor.selections.length === 1) {
			const document = editor.document;
			if (!document) return;

			// start at the beginning of the line.
			const selectedText = document.getText(editor.selection.with(editor.selection.start.with(undefined, 0)));
			if (!selectedText) return;

			const textLines = selectedText.split('\n');

			let indentSize = -1;
			let outLines = [];

			for (let line of textLines) {
				// skip initial empty lines
				if (indentSize == -1) {
					if (line.length == 0) continue;

					indentSize = line.search(/\S/);
					if (indentSize == -1) continue;
				}

				outLines.push( line.substring(indentSize));
			}

			if (outLines.length == 0) return;

			await vscode.env.clipboard.writeText( outLines.join('\n') );
		} else {
			// TODO for v2
			await vscode.commands.executeCommand('editor.action.clipboardCopyAction');
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
