document.querySelectorAll(".faq-section .wp-block-column:nth-child(2) h2").forEach((s=>{s.classList.add("closed"),s.nextElementSibling.classList.add("hide"),s.addEventListener("click",(s=>{const e=s.target,t=s.target?.nextElementSibling;t?.classList?.contains("hide")?t.classList.remove("hide"):t.classList.add("hide"),e?.classList?.contains("closed")?e.classList.remove("closed"):e.classList.add("closed")}))}));