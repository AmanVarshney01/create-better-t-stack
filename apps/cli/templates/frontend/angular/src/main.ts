import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';
import { environment } from './environments/enviroments';

if (environment.production) {
	enableProdMode();
	//show this warning only on prod mode
	if (window) {
		selfXSSWarning();
	}
}
bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));

function selfXSSWarning() {
	setTimeout(() => {
		console.log(
			"%c** STOP **",
			"font-weight:bold; font: 2.5em Arial; color: white; background-color: #e11d48; padding-left: 15px; padding-right: 15px; border-radius: 25px; padding-top: 5px; padding-bottom: 5px;",
		);
		console.log(
			`\n
			%cThis is a browser feature intended for developers. Using this console may allow attackers to impersonate you and steal your information sing an attack called Self-XSS. Do not enter or paste code that you do not understand.`,
			"font-weight:bold; font: 2em Arial; color: #e11d48;",
		);
	});
}
