import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default class StickyGridScroll {
  constructor(root = document) {
    this.root = root;
    this.animations = [];
    this.getElements();
    if (!this.block) return;

    this.initContent();
    this.groupItemsByColumn();
    this.animateIntroImageParallax();
    this.pinWrapperOnScroll();
    this.animateTitleOnScroll();
    this.animateGridOnScroll();
  }

  getElements() {
    this.intro = this.root.querySelector(".block--intro");
    this.introImage = this.intro?.querySelector(".media__image");

    this.block = this.root.querySelector(".block--main");
    if (!this.block) return;

    this.wrapper = this.block.querySelector(".block__wrapper");
    this.content = this.block.querySelector(".content");
    this.title = this.block.querySelector(".content__title");
    this.description = this.block.querySelector(".content__description");
    this.button = this.block.querySelector(".content__button");
    this.grid = this.block.querySelector(".gallery__grid");
    this.items = this.block.querySelectorAll(".gallery__item");
  }

  initContent() {
    if (this.description && this.button) {
      gsap.set([this.description, this.button], {
        opacity: 0,
        pointerEvents: "none",
      });
    }

    if (this.content && this.title) {
      const dy =
        (this.content.offsetHeight - this.title.offsetHeight) / 2;
      this.titleOffsetY = (dy / this.content.offsetHeight) * 100;
      gsap.set(this.title, { yPercent: this.titleOffsetY });
    }
  }

  groupItemsByColumn() {
    this.numColumns = 3;
    this.columns = Array.from({ length: this.numColumns }, () => []);

    this.items.forEach((item, index) => {
      this.columns[index % this.numColumns].push(item);
    });
  }

  animateIntroImageParallax() {
    if (!this.intro || !this.introImage) return;

    const introParallax = gsap.fromTo(
      this.introImage,
      { yPercent: -24 },
      {
        yPercent: 24,
        ease: "none",
        scrollTrigger: {
          trigger: this.intro,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    this.animations.push(introParallax);
  }

  pinWrapperOnScroll() {
    if (!this.block || !this.wrapper) return;

    const pin = ScrollTrigger.create({
      trigger: this.block,
      start: "top top",
      end: "bottom bottom",
      pin: this.wrapper,
      pinSpacing: false,
      scrub: true,
    });

    this.animations.push(pin);
  }

  animateTitleOnScroll() {
    if (!this.block || !this.title) return;

    const titleTween = gsap.from(this.title, {
      duration: 0.7,
      ease: "power1.out",
      scrollTrigger: {
        trigger: this.block,
        start: "top 57%",
        toggleActions: "play none none reset",
      },
    });

    this.animations.push(titleTween);
  }

  gridRevealTimeline(columns = this.columns) {
    const timeline = gsap.timeline();
    const wh = window.innerHeight;
    const dy = wh - (wh - this.grid.offsetHeight) / 2;

    columns.forEach((column, colIndex) => {
      const fromTop = colIndex % 2 === 0;

      timeline.from(
        column,
        {
          y: dy * (fromTop ? -1 : 1),
          stagger: { each: 0.06, from: fromTop ? "end" : "start" },
          ease: "power1.inOut",
        },
        "grid-reveal"
      );
    });

    return timeline;
  }

  gridZoomTimeline(columns = this.columns) {
    const timeline = gsap.timeline({
      defaults: { duration: 1, ease: "power3.inOut" },
    });

    timeline.to(this.grid, { scale: 2.05 });
    timeline.to(columns[0], { xPercent: -40 }, "<");
    timeline.to(columns[2], { xPercent: 40 }, "<");

    timeline.to(
      columns[1],
      {
        yPercent: (i) =>
          (i < Math.floor(columns[1].length / 2) ? -1 : 1) * 40,
        duration: 0.5,
      },
      "-=0.5"
    );

    return timeline;
  }

  toggleContent(isVisible = true) {
    if (!this.title || !this.description || !this.button) return;

    gsap.timeline({ defaults: { overwrite: true } })
      .to(this.title, {
        yPercent: isVisible ? 0 : this.titleOffsetY,
        duration: 0.7,
      })
      .to(
        [this.description, this.button],
        {
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "all" : "none",
        },
        isVisible ? "-=90%" : "<"
      );
  }

  animateGridOnScroll() {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: this.block,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    timeline
      .add(this.gridRevealTimeline())
      .add(this.gridZoomTimeline(), "-=0.6")
      .add(() => this.toggleContent(timeline.scrollTrigger.direction === 1), "-=0.32");

    this.animations.push(timeline);
  }

  destroy() {
    this.animations.forEach((animation) => animation?.kill?.());
    this.animations = [];
  }
}
