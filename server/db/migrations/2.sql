ALTER TABLE `votes` DROP `deletedAt`;
ALTER TABLE `musicGenreTracks` DROP `deletedAt`;

ALTER TABLE `MusicGenreParents` ROW_FORMAT = COMPACT;
ALTER TABLE `MusicGenres` ROW_FORMAT = COMPACT;
ALTER TABLE `MusicGenreTracks` ROW_FORMAT = COMPACT;
ALTER TABLE `Tracks` ROW_FORMAT = COMPACT;
ALTER TABLE `Votes` ROW_FORMAT = COMPACT;
