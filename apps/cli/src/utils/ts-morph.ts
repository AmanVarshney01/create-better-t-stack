import {
	type ArrayLiteralExpression,
	IndentationText,
	type ObjectLiteralExpression,
	Project,
	QuoteKind,
	SyntaxKind,
} from "ts-morph";

export const tsProject = new Project({
	useInMemoryFileSystem: false,
	skipAddingFilesFromTsConfig: true,
	manipulationSettings: {
		quoteKind: QuoteKind.Single,
		indentationText: IndentationText.TwoSpaces,
	},
});

export function ensureArrayProperty(
	obj: ObjectLiteralExpression,
	name: string,
): ArrayLiteralExpression {
	return (obj
		.getProperty(name)
		?.getFirstDescendantByKind(SyntaxKind.ArrayLiteralExpression) ??
		obj
			.addPropertyAssignment({ name, initializer: "[]" })
			.getFirstDescendantByKindOrThrow(
				SyntaxKind.ArrayLiteralExpression,
			)) as ArrayLiteralExpression;
}
