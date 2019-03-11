import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'contact',
  templateUrl: '../../templates/about/contact.component.html'
})
export class ContactComponent {
    submitted = false;

    contactDetails: any = {
        name: null,
        email: null,
        message: null
    };

    baseUrl: string;

    errors: any = {
        name: null,
        email: null,
        message: null
    };

    sent = false;

    constructor(private http: HttpClient) {
        this.baseUrl = environment.publicPath;
    }

    submit() {
        if (this.submitted) { return; }

        this.submitted = true;

        const requestUrl = `${this.baseUrl}/live/site/static/email/send.php`;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

        const data = `name=${this.contactDetails.name}&email=${this.contactDetails.email}&message=${this.contactDetails.message}`;

        this.http.post(
            requestUrl,
            data,
            {
                headers
            }
        ).subscribe(
            res => {
                // Update error messages.
                this.errors.name = res['errors']['name'];
                this.errors.email = res['errors']['email'];
                this.errors.message = res['errors']['message'];

                if (res['success']) {
                    // Reset things.
                    this.errors = this.contactDetails = {
                        name: null,
                        email: null,
                        message: null
                    };
                    this.sent = true;
                }
            }
        );
    }
}
