import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Component({
  selector: 'contact',
  templateUrl: '../../templates/about/contact.component.html'
})
export class ContactComponent {
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

    sent: boolean = false;

    constructor(private http: Http) {
        this.baseUrl = process.env.PUBLIC_PATH;
    }

    submit() {
        console.log('Submitting: ' + JSON.stringify(this.contactDetails));

        // let requestUrl: string = `${this.baseUrl}/email/send.php'`;
        let requestUrl: string = `https://www.jumbledjargon.co.uk/backstage/site/email/send.php`;
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

        let data = `name=${this.contactDetails.name}&email=${this.contactDetails.email}&message=${this.contactDetails.message}`;

        this.http.post(
            requestUrl,
            data,
            {
                headers: headers
            }
        ).subscribe(
            res => {
                // Parse the response
                res = JSON.parse(res['_body']);

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