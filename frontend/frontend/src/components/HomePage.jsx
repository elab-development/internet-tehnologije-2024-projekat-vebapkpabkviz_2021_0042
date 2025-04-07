import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="h-[84vh] flex flex-col justify-around">
      <section className="py-6 basis-1/3 bg-[#1c3144] grid place-items-center text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">
            Join the Ultimate Pub Quiz Experience!
          </h2>
          <p className="text-lg mb-8">
            Engage in fun quizzes and challenge your knowledge.
          </p>
          <Link
            to="/register"
            className="bg-[#7ea16b] hover:bg-[#596f62] text-white font-bold py-3 px-8 rounded"
          >
            Join Our Next Event
          </Link>
        </div>
      </section>
      <section
        id="about"
        className="py-6 basis-1/3 grid place-items-center bg-[#596f62]"
      >
        <div className="max-w-4xl flex flex-col justify-items-center text-center">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-lg">
          Welcome to New London Pub, where great conversation meets exciting challenges in a vibrant 
          and fun setting! We specialize in hosting the most captivating and enjoyable pub quiz events,
           bringing together friends, family, and trivia lovers for unforgettable experiences.
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-[#c3d898] basis-1/3 grid place-items-center py-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Explore More</h2>
          <p className="text-lg mb-8">
            Check out our upcoming events and view the scoreboard.
          </p>
          <Link
            to="/events"
            className="bg-[#7ea16b] hover:bg-[#596f62] text-white font-bold py-3 px-8 rounded mr-4"
          >
            Upcoming events
          </Link>
          <Link
            to="/scoreboard"
            className="bg-[#7ea16b] hover:bg-[#596f62] text-white font-bold py-3 px-8 rounded"
          >
            Scoreboard
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
