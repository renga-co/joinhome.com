import { h, render } from "preact";
import { useState } from "preact/hooks";
import "./subscribe-form.css";

const WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/5834199/o2cdrbp/';
const State = {
  IDLE: 'idle',
  SUBMITTING: 'submitting',
  SUBMITTED: 'submitted',
  ERROR: 'error',
};

function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState(State.IDLE);

  const isDisabled = state !== State.IDLE;

  return (
    <div>
      <form class="SubscribeForm" action="/" method="post" onSubmit={onSubmit}>
        <input
          class="SubscribeForm-email"
          type="email"
          disabled={isDisabled}
          required
          placeholder="Enter your email…"
          onInput={e => setEmail(e.target.value)}
          value={email}
        />
        <button class="SubscribeForm-button" type="submit" disabled={isDisabled}>
          Sign Up
        </button>
      </form>
      <p class="SubscribeForm-caption f-caption">
        {state === State.SUBMITTED ? 'Thanks! We‘ll be in touch.' : state === State.SUBMITTING ? 'Subscribing…' : 'Join the waitlist to get early access.'}
      </p>
    </div>
  );

  function onSubmit (e) {
    e.preventDefault();
    setState(State.SUBMITTING);

    const date = (new Date()).toISOString();
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('createdAt', date);

    fetch(`${WEBHOOK_URL}?${params}`)
      .then(res => {
        setState(State.SUBMITTED);
      })
      .catch(err => {
        console.error(err);
        setState(State.IDLE);
      });
  }
}

for (let el of document.querySelectorAll(".js-subscribeForm")) {
  render(
    <SubscribeForm />,
    el
  );
}
