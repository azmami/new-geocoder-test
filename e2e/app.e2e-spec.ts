import { NewGeocoderPage } from './app.po';

describe('new-geocoder App', function() {
  let page: NewGeocoderPage;

  beforeEach(() => {
    page = new NewGeocoderPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
