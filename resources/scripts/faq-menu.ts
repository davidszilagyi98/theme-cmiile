const questions = document.querySelectorAll(".faq-section .wp-block-column:nth-child(2) h2");

questions.forEach((question) => {
  question.classList.add("closed");
  question.nextElementSibling.classList.add("hide");

  question.addEventListener("click", (e) => {
    const heading = e.target;
    const answer = e.target?.nextElementSibling;

    if (answer?.classList?.contains("hide")) {
      answer.classList.remove("hide");
    } else {
      answer.classList.add("hide");
    }

    if (heading?.classList?.contains("closed")) {
      heading.classList.remove("closed");
    } else {
      heading.classList.add("closed");
    }
  });
});
