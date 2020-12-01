import Link from 'next/link'
import { MusicGenreDetailsType } from '../../../../types/MusicGenre/MusicGenreDetailsType'
import SquareButton from '../../../Atoms/Buttons/SquareButton/SquareButton'
import Heading1 from '../../../Atoms/Headings/Heading1/Heading1'
import PlusIcon from '../../../Atoms/Icons/PlusIcon/PlusIcon'
import TrackCard from '../TrackCard/TrackCard'
import classes from './GenrePage.module.scss'

interface Props {
  genre: MusicGenreDetailsType
}
const GenrePage: React.FC<Props> = ({ genre }) => {
  return (
    <div className={classes.container}>
      {/* Heading */}
      <Heading1># {genre.name}</Heading1>

      {/* Tracks listing */}
      <div className={classes.tracks}>
        <div className="row">
          {genre.tracks.map((track) => (
            <div key={track.id} className="col-xs-4">
              <TrackCard track={track} />
            </div>
          ))}
        </div>
      </div>

      {/* Add track */}
      <div className={classes.addContainer}>
        <Link href={`/add/video/${genre.slug}`}>
          <a>
            <SquareButton>
              <PlusIcon />
              Add video
            </SquareButton>
          </a>
        </Link>
      </div>
    </div>
  )
}
export default GenrePage