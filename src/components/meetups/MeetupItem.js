import { useContext } from "react";
import { FavoritesContext } from "../../App";
import classes from "./MeetupItem.module.css";
import Card from "../ui/Card";

export default function MeetupItem({ meetup }) {
  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);

  const isItemFavorite = isFavorite(meetup.id);

  const toggleFavoriteHandler = () => {
    if (isItemFavorite) {
      removeFavorite(meetup.id);
    } else {
      addFavorite(meetup);
    }
  };

  return (
    <li className={classes.item} data-test='meet-up-item'>
      <Card>
        <div className={classes.image}>
          <img src={meetup.image} alt={meetup.title} />
        </div>
        <div className={classes.content}>
          <h3>{meetup.title}</h3>
          <address>{meetup.address}</address>
          <p>{meetup.description}</p>
        </div>
        <div className={classes.actions}>
          <button onClick={toggleFavoriteHandler}>
            {isItemFavorite ? 'Remove from favorites' : 'Add to favorites'}
          </button>
        </div>
      </Card>
    </li>
  );
}
