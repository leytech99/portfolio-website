const transparentLogoImages=[...document.querySelectorAll("[data-transparent-logo]")];
function makeTransparentLogo(){
  transparentLogoImages.forEach(img=>{
    const source=img.src;
    const temp=new Image();
    temp.onload=()=>{
      const canvas=document.createElement("canvas");
      const ctx=canvas.getContext("2d");
      canvas.width=temp.naturalWidth;
      canvas.height=temp.naturalHeight;
      ctx.drawImage(temp,0,0);
      const {data}=ctx.getImageData(0,0,canvas.width,canvas.height);
      for(let i=0;i<data.length;i+=4){
        const r=data[i],g=data[i+1],b=data[i+2];
        if(r>245&&g>245&&b>245){ data[i+3]=0; }
      }
      ctx.putImageData(new ImageData(data,canvas.width,canvas.height),0,0);
      img.src=canvas.toDataURL("image/png");
      img.style.background="transparent";
    };
    temp.src=source;
  });
}

const preloader=document.querySelector(".preloader");
window.addEventListener("load",()=>{
  makeTransparentLogo();
  if(preloader)setTimeout(()=>preloader.classList.add("hide"),450);
});

const header=document.querySelector(".site-header");
const scrollProgress=document.querySelector(".scroll-progress span");
let scrollScheduled=false;
window.addEventListener("scroll",()=>{
  if(scrollScheduled)return;
  scrollScheduled=true;
  requestAnimationFrame(()=>{
    header.classList.toggle("scrolled",window.scrollY>20);
    const scrollableHeight=document.documentElement.scrollHeight-window.innerHeight;
    if(scrollProgress){
      const progress=scrollableHeight>0?window.scrollY/scrollableHeight:0;
      scrollProgress.style.transform=`scaleX(${Math.min(1,Math.max(0,progress))})`;
    }
    const sections=[...document.querySelectorAll("main section[id]")];
    const links=[...document.querySelectorAll(".nav-link")];
    let current="home";
    sections.forEach(section=>{if(window.scrollY>=section.offsetTop-150) current=section.id});
    links.forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#"+current));
    scrollScheduled=false;
  });
},{passive:true});

const menuToggle=document.querySelector(".menu-toggle");
const navMenu=document.querySelector(".nav-menu");
menuToggle.addEventListener("click",()=>{
  const open=navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded",open);
});
document.querySelectorAll(".nav-menu a").forEach(link=>link.addEventListener("click",()=>{
  navMenu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded","false");
}));

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
},{threshold:.08,rootMargin:"0px 0px -36px 0px"});
document.querySelectorAll(".reveal").forEach(el=>{
  const siblings=[...el.parentElement.children].filter(sibling=>sibling.classList.contains("reveal"));
  el.style.setProperty("--reveal-delay",`${Math.min(siblings.indexOf(el),4)*90}ms`);
  observer.observe(el);
});

const filters=document.querySelectorAll(".filter");
const cards=document.querySelectorAll(".project-card");
filters.forEach(filter=>filter.addEventListener("click",()=>{
  filters.forEach(f=>f.classList.remove("active"));
  filter.classList.add("active");
  const value=filter.dataset.filter;
  cards.forEach(card=>{
    const show=value==="all"||card.dataset.category===value;
    card.style.display=show?"block":"none";
  });
}));

const projectData={
  kingsclothing:{
    type:"BUSINESS / FASHION",
    title:"Kingsclothing",
    overview:"A premium fashion brand experience designed around strong visual presentation, clean typography and a confident masculine identity.",
    problem:"Present a fashion brand with a polished digital presence while keeping the experience simple and focused on the brand.",
    solution:"Created a clean editorial-style interface with strong imagery, clear navigation and conversion-focused calls to action.",
    tech:"HTML5, CSS3, JavaScript, Responsive Design",
    features:"Responsive layout, product presentation, brand storytelling, CTA sections and mobile-first navigation."
  },
  "golden-glow":{
    type:"E-COMMERCE / FURNITURE",
    title:"Golden Glow",
    overview:"A modern furniture e-commerce concept focused on premium product presentation, customization and a refined shopping experience.",
    problem:"Create a furniture store interface that feels premium without becoming visually cluttered.",
    solution:"Used spacious layouts, product-focused sections and a warm luxury visual system to support discovery and purchase intent.",
    tech:"HTML5, CSS3, JavaScript, UI/UX",
    features:"Product cards, category browsing, customization concepts, responsive layouts and conversion-focused CTAs."
  },
  ticom:{
    type:"BUSINESS / TECHNOLOGY",
    title:"Ticom Networking",
    overview:"A professional website for networking equipment, structured cabling products and installation services.",
    problem:"Position a Nigerian networking business as a professional technology supplier rather than a generic electronics store.",
    solution:"Built a technical, trustworthy interface with clear product categories, service sections and enquiry paths.",
    tech:"HTML5, CSS3, Vanilla JavaScript",
    features:"Product categories, service presentation, responsive navigation, enquiry CTA and structured information architecture."
  },
  gunshen:{
    type:"BUSINESS / ENERGY",
    title:"Gunshen Solar",
    overview:"A modern solar company website for showcasing solar panels, inverters and lithium batteries with WhatsApp-focused enquiries.",
    problem:"Give a solar business a credible online presence while making it easy for customers to enquire.",
    solution:"Designed a clean energy-focused layout with product categories, trust-building sections and direct enquiry actions.",
    tech:"HTML5, CSS3, Vanilla JavaScript",
    features:"Product showcase, service information, responsive layout, WhatsApp CTA and contact sections."
  },
  tourism:{
    type:"LANDING PAGE / TRAVEL",
    title:"Travel & Tourism",
    overview:"A visual travel experience built around destination discovery, storytelling and immersive presentation.",
    problem:"Create a tourism interface where imagery and concise content drive exploration.",
    solution:"Used large visual sections, strong typography and a clear content hierarchy to create an editorial travel experience.",
    tech:"HTML5, CSS3, JavaScript, Responsive Design",
    features:"Destination sections, visual storytelling, responsive layout, navigation and strong CTA moments."
  }
};

const modal=document.querySelector("#projectModal");
const modalTitle=document.querySelector("#modalTitle");
document.querySelectorAll(".project-card").forEach(card=>card.addEventListener("click",()=>{
  const data=projectData[card.dataset.project];
  if(!data)return;
  document.querySelector("#modalType").textContent=data.type;
  modalTitle.textContent=data.title;
  document.querySelector("#modalOverview").textContent=data.overview;
  document.querySelector("#modalProblem").textContent=data.problem;
  document.querySelector("#modalSolution").textContent=data.solution;
  document.querySelector("#modalTech").textContent=data.tech;
  document.querySelector("#modalFeatures").textContent=data.features;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");
}));
document.querySelectorAll("[data-close]").forEach(el=>el.addEventListener("click",closeModal));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
function closeModal(){modal.classList.remove("show");modal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open")}

document.querySelector("#contactForm").addEventListener("submit",e=>{
  e.preventDefault();
  const form=e.currentTarget;
  const note=document.querySelector("#formNote");
  const formData=new FormData(form);
  const message=[
    "New project enquiry",
    `Name: ${formData.get("name")}`,
    `Email: ${formData.get("email")}`,
    `Project type: ${formData.get("type")}`,
    `Message: ${formData.get("message")}`
  ].join("\n");
  const whatsappUrl=`https://wa.me/2348130242792?text=${encodeURIComponent(message)}`;
  const whatsappWindow=window.open(whatsappUrl,"_blank");

  if(whatsappWindow){
    whatsappWindow.opener=null;
    note.textContent="WhatsApp opened with your message. Tap Send in WhatsApp to deliver it.";
  }else{
    note.textContent="Your browser blocked the WhatsApp tab. Allow pop-ups for this site and try again.";
  }
});
