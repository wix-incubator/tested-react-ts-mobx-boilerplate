import {expect, waitForDom} from 'test-drive-react';
import * as Promise from 'bluebird';

const ifr = document.createElement('iframe');
ifr.width = "100%";
ifr.height = "500px";
ifr.src = "about:blank";
document.body.appendChild(ifr); // add it to wherever you need it in the document


function navigateTo(path: string): Promise<void> {
    return new Promise<any>(function (resolve, reject) {
        ifr.onload = resolve;
        ifr.src = path;
    }).then(() => {
    });
}


describe("End-to-end tests", function () {
    this.timeout(60 * 1000);

    before('Waiting for server to become responsive', function () {
        this.timeout(60 * 1000);
        return navigateTo('/');
    });

    describe('test page', function () {
        it('renders interactively on client', function () {
            this.timeout(60 * 1000);
            return waitForDom(ifr.contentDocument.body​, (b) => {
                const li = b.querySelector("li[data-automation-id='todo_1']");
                expect(li, 'the first todo').to.be.ok;
                expect((li as Element).textContent).to.equal('Use Mobx');
            });
        });
    });
});
