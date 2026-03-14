import { GRID_COLUMNS, GRID_ROWS } from './pdfCoordinates';

export interface GridCharacterPlacement {
  char: string;
  row: number;
  column: number;
}

export interface GridPage {
  characters: GridCharacterPlacement[];
}

function ensurePage(pages: GridPage[], index: number) {
  if (!pages[index]) {
    pages[index] = { characters: [] };
  }
}

export function layoutGridText(content: string): GridPage[] {
  const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const pages: GridPage[] = [];

  if (!normalizedContent.length) {
    return [{ characters: [] }];
  }

  let pageIndex = 0;
  let row = 0;
  let column = 0;

  for (const char of normalizedContent) {
    if (row >= GRID_ROWS) {
      pageIndex += 1;
      row = 0;
      column = 0;
    }

    if (char === '\n') {
      row += 1;
      column = 0;
      continue;
    }

    ensurePage(pages, pageIndex);
    pages[pageIndex].characters.push({ char, row, column });

    column += 1;

    if (column >= GRID_COLUMNS) {
      column = 0;
      row += 1;
    }
  }

  return pages.length ? pages : [{ characters: [] }];
}
