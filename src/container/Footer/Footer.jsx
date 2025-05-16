import React, { useRef } from "react";
import { images } from "../../constants";
import { Tooltip as ReactTooltip } from "react-tooltip";
import emailjs from "emailjs-com";
import "./Footer.css";

const Footer = () => {
  const copyText = function (e) {
    let parentDiv = e.currentTarget;
    let button = parentDiv.children[1];
    let textArea = document.createElement("textarea");
    let ptags = [...button.children];

    // Copy text
    textArea.setAttribute("readonly", "");
    textArea.style.position = "absolute";
    textArea.style.top = "0";
    textArea.style.opacity = "0";
    textArea.value = button.textContent.replace("Text Copied!", "");
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");

    // Add particle
    let lottie = parentDiv.children[2];
    lottie.play();

    // Toggle between info to text copied
    ptags.forEach((el) => el.classList.add("active"));

    // Prevent spam
    parentDiv.style.pointerEvents = "none";

    setTimeout(() => {
      ptags.forEach((el) => el.classList.remove("active"));

      parentDiv.style.pointerEvents = "all";
      lottie.stop();
    }, 2500);
  };

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      "service_shbm2aa", // Replace with your service ID
      "template_ipqzw5l", // Replace with your template ID
      form.current,
      "yM8CqlPMhDguFYshq" // Replace with your user ID
    )
      .then(
        (result) => {
          console.log(result.text);
          alert("Message sent successfully!");
        },
        (error) => {
          console.log(error.text);
          alert("Failed to send the message, please try again.");
        }
      );

    e.target.reset();
  };

  return (
    <div id="contact" style={{ paddingTop: "6rem" }}>
      <h2 className="head-text">Take a coffee & chat with me</h2>

      <div className="app__footer-cards">
        {["mobile", "email"].map((el) => {
          return (
            <div
              key={el}
              className="app__footer-card"
              data-tooltip-content="Tap to copy"
              data-tooltip-id="tooltip"
              onClick={(e) => copyText(e)}
              data-ccursor="lift"
            >
              <img src={images[el]} alt={el} />
              <h6 className="p-text btn-copy">
                <p>{el === "mobile" ? "+1 (531) 229-9988" : "szk0232@auburn.edu"}</p>
                <span>Text Copied!</span>
              </h6>

              <lottie-player
                src="https://lottie.host/ba5f1b29-c134-49e6-92a5-0c3c0138ac41/1fZfylyQsU.json"
                style={{
                  height: "100%",
                  width: "100%",
                  transform: "scale(2.6) translateX(-50px)",
                }}
              ></lottie-player>

              <h4>COPY</h4>
            </div>
          );
        })}
        <ReactTooltip
          styles={{ position: "absolute", top: 0, left: 0 }}
          id="tooltip"
        ></ReactTooltip>
      </div>

      <form ref={form} onSubmit={sendEmail} className="app__footer-form app__flex">
        <div className="app__flex">
          <input className="p-text" type="text" placeholder="Full Name" name="from_name" required data-ccursor="noParallax" />
        </div>
        <div className="app__flex">
          <input className="p-text" type="email" placeholder="Your Email" name="from_email" required data-ccursor="noParallax" />
        </div>
        <div>
          <textarea className="p-text" placeholder="Your Message" name="message" required data-ccursor="noParallax" />
        </div>
        <button type="submit" className="p-text" data-ccursor="lift">
          Send message
        </button>
      </form>

      <p className="copyright">Simrandeep Kaur &copy;2024</p>
    </div>
  );
};

export default Footer;
