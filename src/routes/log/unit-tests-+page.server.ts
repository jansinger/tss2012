import { load } from './<fileName>.js';
import { LogEntryShort } from '$lib/types';

describe('load', () => {
  const origEntries = [
    {
      _id: 1,
      title: 'Title 1',
      section: 'Section 1',
      abstract: 'Abstract 1',
      datetime: '2021-01-01',
      localeDatetime: 'January 1, 2021',
      pictureFolder: 'folder1',
      pictures: [
        {
          filename: 'picture1.jpg',
          title: 'Picture 1'
        }
      ]
    },
    {
      _id: 2,
      title: 'Title 2',
      section: 'Section 2',
      abstract: 'Abstract 2',
      datetime: '2021-02-02',
      localeDatetime: 'February 2, 2021',
      pictureFolder: 'folder2',
      pictures: [
        {
          filename: 'picture2.jpg',
          title: 'Picture 2'
        }
      ]
    }
  ];

  const entries: LogEntryShort[] = origEntries.map((entry) => ({
    id: entry._id,
    title: entry.title,
    section: entry.section,
    abstract: entry.abstract,
    datetime: entry.datetime,
    localeDatetime: entry.localeDatetime,
    picture: `${entry.pictureFolder}/${entry.pictures[0].filename}`,
    pictureTitle: entry.pictures[0].title
  }));

  it('should return entries when called', () => {
    const result = load();
    expect(result).toEqual({ entries });
  });
});