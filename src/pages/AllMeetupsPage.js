import MeetupItem from "../components/meetups/MeetupItem";
import { useFetch } from "../util-hooks/useFetch";
import classes from "./../components/meetups/MeetupList.module.css";

export default function AllMeetupsPage() {
  const { data: meetups } = useFetch({
    url: "/data.json",
  });

  if (!meetups) return <p>Loading...</p>;

  return (
    <section>
      <h1>All Meetups</h1>
      <ul className={classes.list}>
        {meetups.map((meetup) => (
          <MeetupItem key={meetup.id} meetup={meetup} />
        ))}
      </ul>
    </section>
  );
}
