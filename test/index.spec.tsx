import React = require('react');
import {expect, ClientRenderer, simulate, waitFor} from 'test-drive-react';
import {Main} from "../src/main";


describe("Foo", function () {

    const clientRenderer = new ClientRenderer();

    afterEach(() => {
        clientRenderer.cleanup();
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

});
