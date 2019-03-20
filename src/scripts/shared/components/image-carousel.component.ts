import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef, Inject } from '@angular/core';
import { ImageCarousel } from '../models/image-carousel';
import { WindowService } from '../services/window.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'image-carousel',
    templateUrl: '../../../templates/shared/image-carousel.component.html'
})
export class ImageCarouselComponent implements OnInit {

    constructor(
        public windowService: WindowService,
        private ref: ChangeDetectorRef,
        @Inject(PLATFORM_ID) private platformId
    ) {
        this.windowService = windowService;
    }

    public TIMER_DURATION = 13000;
    private ELEMENT_STYLE = 'grow-width ' + this.TIMER_DURATION + 'ms infinite linear';

    @Input() imageCarousel: ImageCarousel;
    @ViewChild('progressBar') progressBar: ElementRef;

    public index = 0;

    private interval: any;

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId) && this.imageCarousel.isAnimated && this.progressBar.nativeElement) {
            this.progressBar.nativeElement.style.animation = this.ELEMENT_STYLE;
            this.interval = setInterval(this.advanceTimer.bind(this), this.TIMER_DURATION);
        }
    }

    setIndex(index: number, resetTimer: boolean) {
        this.index = index;
        if (resetTimer) {
            if (isPlatformBrowser(this.platformId) && this.interval && this.progressBar.nativeElement) {
                clearInterval(this.interval);
                this.progressBar.nativeElement.style.animation = '';
                this.ref.detectChanges();
            }

            if (isPlatformBrowser(this.platformId) && this.imageCarousel.isAnimated) {
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
