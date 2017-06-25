import React = require('react');
import {expect, ClientRenderer, simulate, waitFor} from 'test-drive-react';
import { browserHistory } from 'react-router';
import {Main} from "../src/main";

const testUrl: string = '/';
const origUrl = browserHistory.getCurrentLocation().pathname;

describe("Foo", function () {

    const clientRenderer = new ClientRenderer();

    beforeEach(() => {
        browserHistory.push(testUrl);
    });

    afterEach(() => {
        clientRenderer.cleanup();
    });

    after(() => {
        browserHistory.push(origUrl);
    });

    it('renders todo app', function () {
        const {select} = clientRenderer.render(<Main/>);
        expect(select('TODO_ROOT')).to.be.present();
    });

    it('changes route after click', function () {
        const {select} = clientRenderer.render(<Main/>);
        simulate.click(select('BUTTON_ACTIVE'));

        return waitFor(() => {
            expect(window.location.href.endsWith('#active')).to.be.true;
        });
    });

    it('renders component according to route', function () {
        browserHistory.push('/#completed');
        const {select} = clientRenderer.render(<Main/>);

        return waitFor(() => {
            expect((select('BUTTON_COMPLETED') as HTMLElement).className).to.contain('selected');
        });
    });

});
