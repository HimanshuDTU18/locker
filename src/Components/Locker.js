import { animate, reverseEasing } from "framer-motion";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Locker() {
  const [password, setPassword] = useState("");
  const [lock, setLock] = useState(false);
  const [time, setTime] = useState(
    localStorage.getItem("time")  ? localStorage.getItem("time")>=0 ? localStorage.getItem("time") : 300 : 300 
  );
  const [lockup, setLockup] = useState(null);

  useEffect(() => {
    if (lock && time >= 0) {
      setLockup(
        setInterval(() => {
          setTime((prevTime) => prevTime - 1);
        }, 1000)
      );
    } else {
      clearInterval(lockup);
      // setTime(230);
    }
  }, [lock]);

  useEffect(() => {
    if (time == 0) {
      clearInterval(lockup);
      setLock(false);
      runReverseTransition();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Time is up!",
      });
      //   setTime(300);
    }
  }, [time]);

  const runTransition = () => {
    setLock(true);
    const box = document.getElementsByClassName("Locker-circle")[0];
    const lockerFade = document.getElementsByClassName("locker-fade");
    animate(box, { opacity: 0, rotate: 360 }, { duration: 5 });
    const elementWidth1 = lockerFade[0].offsetWidth;
    animate(lockerFade[0], { x: [0, -elementWidth1] }, { duration: 5 });

    const elementWidth2 = lockerFade[1].offsetWidth;
    animate(lockerFade[1], { x: [0, +elementWidth2] }, { duration: 5 });
  };

  const runReverseTransition = () => {
    const box = document.getElementsByClassName("Locker-circle")[0];
    const lockerFade = document.getElementsByClassName("locker-fade");
    animate(box, { opacity: 1, rotate: 0 }, { duration: 5 });
    const elementWidth1 = lockerFade[0].offsetWidth;
    animate(lockerFade[0], { x: [-elementWidth1, 0] }, { duration: 5 });

    const elementWidth2 = lockerFade[1].offsetWidth;
    animate(lockerFade[1], { x: [+elementWidth2, 0] }, { duration: 5 });
  };
  const handleEnterLab = () => {
    if (password === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a password!",
      });
      return;
    }
    if (password === "1234") {
      if (time <= 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "You have exhausted your allocated time!",
        });
        return;
      }
      runTransition();
      setPassword("");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You have entered an incorrect password!",
      });
    }
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedSeconds =
      remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

    return `${minutes}:${formattedSeconds}`;
  }

  return (
    <>
      <div className="flex w-full h-[100vh] gap-1  Locker-Bg relative">
        <div className="w-[50%] border-cyan-200 h-full border-[7px] locker-fade"></div>
        <div className="Locker-circle flex justify-center items-center flex-col gap-5">
          <div className="text-[#fff] text-center w-[70%]">
            Save time in localStorage to shorten the time -- Parameter Name =
            (time) in seconds{" "}
          </div>
          <div className="text-[#fff]">ENTER YOUR PILEARNING PASSWORD</div>
          <div>
            <input
              type="password"
              value={password}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  handleEnterLab();
                }
              }}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </div>
          <div className="enter-lab">
            <button onClick={handleEnterLab}>Enter Lab</button>
          </div>
        </div>
        <div className="w-[50%] border-cyan-200 h-full border-[7px] locker-fade">
          <div
            className=" text-white timer
            font-bold text-2xl text-center flex justify-center items-center h-full ml-20 relative z-20
          "
          >
            {formatTime(time)} left out of 5:00
          </div>
        </div>
        {lock && (
          <div className="absolute entering top-0 left-0 w-full h-full gap-4 flex-col bg-black bg-opacity-50 flex justify-center z-20 items-center">
            <div className="text-white text-4xl text-center">
              You have successfully entered the lab
            </div>
            <div className="enter-lab">
              <button
                onClick={() => {
                  runReverseTransition();
                  setLock(false);
                }}
              >
                Exit
              </button>
            </div>
            <div
              className="text-white
            font-bold text-2xl text-center flex justify-center items-center "
            >
              {formatTime(time)} left out of 5:00
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Locker;
