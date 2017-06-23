import React = require('react');
import {expect, waitForDom, ClientRenderer, simulate, waitFor} from 'test-drive-react';
import { browserHistory } from 'react-router';
import {Main} from "../src/main";

const testUrl = '/';

describe("Foo", function () {

    let clientRenderer: ClientRenderer;

    before(() => {
        browserHistory.push(testUrl);
        clientRenderer = new ClientRenderer();
    });

    afterEach(() => {
        browserHistory.push(testUrl);
        clientRenderer.cleanup();
    });

    it('renders todo app', function () {
        const {select, waitForDom} = clientRenderer.render(<Main/>);
        expect(select('TODO_ROOT')).to.be.present();
    });

    it('changes route after click', function () {
        const {select, waitForDom} = clientRenderer.render(<Main/>);
        simulate.click(select('BUTTON_ACTIVE'));

        return waitFor(() => {
            expect(window.location.href.endsWith('#active')).to.be.true;
        });
    });


});
