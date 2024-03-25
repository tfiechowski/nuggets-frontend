import Container from '@/components/landing/Container';

export function BetaSignup() {
  return (
    <div className="flex h-full w-full landing-dark-background py-8">
      <Container className="flex flex-wrap mb-20 lg:gap-10 lg:flex-nowrap justify-center">
        <div id="mc_embed_shell">
          <link
            href="//cdn-images.mailchimp.com/embedcode/classic-061523.css"
            rel="stylesheet"
            type="text/css"
          />
          <style
            type="text/css"
            dangerouslySetInnerHTML={{
              __html:
                '\n        #mc_embed_signup{background:#fff; false;clear:left; font:14px; width: 600px;}\n        /* Add your own Mailchimp form style overrides in your site stylesheet or in this style block.\n           We recommend moving this block and the preceding CSS link to the HEAD of your HTML file. */\n',
            }}
          />
          <div id="mc_embed_signup">
            <form
              action="https://getnuggets.us22.list-manage.com/subscribe/post?u=b8166f961f7da12888d1b2f22&amp;id=19b29ad0d6&amp;f_id=0009c0e1f0"
              method="post"
              id="mc-embedded-subscribe-form"
              name="mc-embedded-subscribe-form"
              className="validate"
              target="_blank"
            >
              <div id="mc_embed_signup_scroll">
                <h2 className="font-bitter">Join the closed beta now!</h2>
                <div className="mc-field-group">
                  <label htmlFor="mce-EMAIL">
                    Email Address <span className="asterisk">*</span>
                  </label>
                  <input
                    type="email"
                    name="EMAIL"
                    className="required email"
                    id="mce-EMAIL"
                    required={false}
                    defaultValue=""
                  />
                </div>
                <div id="mce-responses" className="clear foot">
                  <div className="response" id="mce-error-response" style={{ display: 'none' }} />
                  <div className="response" id="mce-success-response" style={{ display: 'none' }} />
                </div>
                <div aria-hidden="true" style={{ position: 'absolute', left: '-5000px' }}>
                  /* real people should not fill this in and expect good things - do not remove this
                  or risk form bot signups */
                  <input
                    type="text"
                    name="b_b8166f961f7da12888d1b2f22_19b29ad0d6"
                    tabIndex={-1}
                    defaultValue=""
                  />
                </div>
                <div className="optionalParent">
                  <div className="clear foot">
                    <input
                      type="submit"
                      name="subscribe"
                      id="mc-embedded-subscribe"
                      className="button landing-accent-button"
                      defaultValue="Subscribe"
                    />
                    <p style={{ margin: '0px auto' }}>
                      <a
                        href="http://eepurl.com/iMMNaQ"
                        title="Mailchimp - email marketing made easy and fun"
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            backgroundColor: 'transparent',
                            borderRadius: 4,
                          }}
                        >
                          <img
                            className="refferal_badge"
                            src="https://digitalasset.intuit.com/render/content/dam/intuit/mc-fe/en_us/images/intuit-mc-rewards-text-dark.svg"
                            alt="Intuit Mailchimp"
                            style={{
                              width: 220,
                              height: 40,
                              display: 'flex',
                              padding: '2px 0px',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          />
                        </span>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
