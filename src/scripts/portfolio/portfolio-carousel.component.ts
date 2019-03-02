import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ImageCarousel } from '../shared/models/image-carousel';
import { WindowService } from '../shared/services/window.service';

@Component({
    selector: 'portfolio-carousel',
    templateUrl: '../../templates/portfolio/portfolio-carousel.component.html'
})
export class PortfolioCarouselComponent implements OnInit {

    constructor(
        public windowService: WindowService,
        private ref: ChangeDetectorRef
    ) {
        this.windowService = windowService;
    }

    public TIMER_DURATION = 5000;
    private ELEMENT_STYLE = 'grow-width ' + this.TIMER_DURATION + 'ms infinite linear';

    @Input() imageCarousel: ImageCarousel;
    @ViewChild('progressBar') progressBar: ElementRef;

    public index = 0;

    private interval: any;

    ngOnInit(): void {
        if (this.imageCarousel.isAnimated) {
            this.progressBar.nativeElement.style.animation = this.ELEMENT_STYLE;
            this.interval = setInterval(this.advanceTimer.bind(this), this.TIMER_DURATION);
        }
    }

    setIndex(index: number, resetTimer: boolean) {
        this.index = index;
        if (resetTimer) {
            if (this.interval) {
                clearInterval(this.interval);
                this.progressBar.nativeElement.style.animation = '';
                this.ref.detectChanges();
            }

            if (this.imageCarousel.isAnimated) {
                this.interval = setInterval(this.advanceTimer.bind(this), this.TIMER_DURATION);
                this.progressBar.nativeElement.style.animation = this.ELEMENT_STYLE;
            }
        }
    }

    advanceTimer() {
        this.setIndex(this.index + 1, false);
        if (this.index > this.imageCarousel.items.length - 1) {
            this.setIndex(0, false);
        }
    }
}
