//styles is used to give the body margin-bottom 75px
import EventCard from "../../components/EventCard/EventCard.jsx";

const Feed = () => {
  // Sample array of event data
  const events = [
    {
      type: "specific",
      eventData: {
        eventCreator: "Louise",
        eventName: "Concert at the Park",
        eventDescription: "Join this concert!",
        eventDate: "17/1 - 2023",
        eventRSVP: "5/1 - 2023",
      },
    },
    {
      type: "specificPoll",
      eventData: {
        eventCreator: "Martin",
        eventName: "Team Meeting",
        eventDescription:
          "We have some stuff to talk about, but we need to make sure that everyone can particiape.",
        eventDateOptions: ["17/1 - 2023", "18/1 - 2023"],
        eventRSVP: "5/1 - 2023",
      },
    },
    {
      type: "openPoll",
      eventData: {
        eventCreator: "Henrik",
        eventName: "Weekend Getaway",
        eventDate: "To be decided",
        eventDescription:
          "It's about time we finally take the trip to my parents summerhouse. Let week suits all of y'all.",
        eventRSVP: "5/1 - 2023",
      },
    },
    {
      type: "specific",
      eventData: {
        eventCreator: "Gustav",
        eventName: "Party at my place",
        eventDescription:
          "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
        eventDate: "18/1 - 2023",
        eventRSVP: "None",
      },
    },
  ];

  return (
    <div>
      {events.map((event, index) => (
        <EventCard key={index} type={event.type} eventData={event.eventData} />
      ))}
    </div>
  );
};

export default Feed;
