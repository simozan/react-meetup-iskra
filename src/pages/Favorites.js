import { useContext } from "react";
import { FavoritesContext } from "../App";
import MeetupItem from "../components/meetups/MeetupItem";
import classes from "../components/meetups/MeetupList.module.css";

export default function FavoritesPage() {
  const { favorites } = useContext(FavoritesContext);

  if (favorites.length === 0) {
    return (
      <section>
        <h1>My Favorites</h1>
        <p>You have no favorite meetups yet. Start adding some!</p>
      </section>
    );
  }

  return (
    <section>
      <h1>My Favorites</h1>
      <ul className={classes.list}>
        {favorites.map((meetup) => (
          <MeetupItem key={meetup.id} meetup={meetup} />
        ))}
      </ul>
    </section>
  );
}
