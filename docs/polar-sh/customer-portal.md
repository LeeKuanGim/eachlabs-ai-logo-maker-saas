# Embedded Checkout

> Embed our checkout directly on your site

<img src="https://mintcdn.com/polar/Ut0vPUvE1pIdMcH2/assets/features/checkout/embed/demo.png?fit=max&auto=format&n=Ut0vPUvE1pIdMcH2&q=85&s=721c4f727f588f28851d8da2322daf16" data-og-width="3680" width="3680" data-og-height="2236" height="2236" data-path="assets/features/checkout/embed/demo.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/polar/Ut0vPUvE1pIdMcH2/assets/features/checkout/embed/demo.png?w=280&fit=max&auto=format&n=Ut0vPUvE1pIdMcH2&q=85&s=e3f8f37a1c1b77a90c6665f48ce073d7 280w, https://mintcdn.com/polar/Ut0vPUvE1pIdMcH2/assets/features/checkout/embed/demo.png?w=560&fit=max&auto=format&n=Ut0vPUvE1pIdMcH2&q=85&s=da785d45034ef0b276d690b0529bd798 560w, https://mintcdn.com/polar/Ut0vPUvE1pIdMcH2/assets/features/checkout/embed/demo.png?w=840&fit=max&auto=format&n=Ut0vPUvE1pIdMcH2&q=85&s=e0e25deefa02bde98bf7b14c2d8b9d1a 840w, https://mintcdn.com/polar/Ut0vPUvE1pIdMcH2/assets/features/checkout/embed/demo.png?w=1100&fit=max&auto=format&n=Ut0vPUvE1pIdMcH2&q=85&s=c3e65abb8cc2a5f6cd80c060bfbd01cb 1100w, https://mintcdn.com/polar/Ut0vPUvE1pIdMcH2/assets/features/checkout/embed/demo.png?w=1650&fit=max&auto=format&n=Ut0vPUvE1pIdMcH2&q=85&s=17fb67d868489bb4155c6f2c3b116ee4 1650w, https://mintcdn.com/polar/Ut0vPUvE1pIdMcH2/assets/features/checkout/embed/demo.png?w=2500&fit=max&auto=format&n=Ut0vPUvE1pIdMcH2&q=85&s=87bd933324c57090e46d2120f73cd407 2500w" />

You can either copy and paste our code snippet to get up and running in a second or use our JavaScript library for more advanced integrations. Our embedded checkout allows you to provide a seamless purchasing experience without redirecting users away from your site.

## Code Snippet

The code snippet can be used on any website or CMS that allows you to insert HTML.

First, create a [Checkout Link](/features/checkout/links) as described in the previous section. The code snippet can directly be copied from there by clicking on `Copy Embed Code`.

The snippet looks like this:

```typescript  theme={null}
<a
  href="__CHECKOUT_LINK__"
  data-polar-checkout
  data-polar-checkout-theme="light"
>
  Purchase
</a>
<script
  src="https://cdn.jsdelivr.net/npm/@polar-sh/checkout@0.1/dist/embed.global.js"
  defer
  data-auto-init
></script>
```

This will display a `Purchase` link which will open an inline checkout when clicked.

You can style the trigger element any way you want, as long as you keep the `data-polar-checkout` attribute.

## Import Library

If you have a more advanced project in JavaScript, like a React app, adding the `<script>` tag may not be an option. In this case, you can install our dedicated library.

<CodeGroup>
  ```bash npm theme={null}
  npm install @polar-sh/checkout
  ```

  ```bash pnpm theme={null}
  pnpm add @polar-sh/checkout
  ```

  ```bash yarn theme={null}
  yarn add @polar-sh/checkout
  ```
</CodeGroup>

Then, you should import the `PolarEmbedCheckout` helper class and manually call `PolarEmbedCheckout.init()`. This will add the required handlers on elements having the `data-polar-checkout` attribute.

Here is an example in React:

```ts  theme={null}
import { PolarEmbedCheckout } from '@polar-sh/checkout/embed'
import { useEffect } from 'react'

const PurchaseLink = () => {
  useEffect(() => {
    PolarEmbedCheckout.init()
  }, [])

  return (
    <a
      href="__CHECKOUT_LINK__"
      data-polar-checkout
      data-polar-checkout-theme="light"
    >
      Purchase
    </a>
  )
}

export default PurchaseLink
```

<Tip>
  Instead of a Checkout Link, you can also use a [Checkout Session](/features/checkout/session) URL created dynamically from the API.

  For this to work, make sure to set the [`embed_origin`](/api-reference/checkouts/create-session#body-embed-origin) parameter correctly when creating the Checkout Session. For example, if your checkout page is served on the URL `https://example.com/checkout`, you should set `embed_origin` to `https://example.com`.
</Tip>

## Advanced Integration

For users who need more control over the embedded checkout flow, the `PolarEmbedCheckout` class provides several advanced features.

### Programmatically creating an embed

Instead of using declarative triggers with `data-polar-checkout` attributes, you can programmatically create and control checkout instances:

```ts  theme={null}
import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";

// Open checkout programmatically when needed
const openCheckout = async () => {
  const checkoutLink = "__CHECKOUT_LINK__";
  const theme = "light"; // or 'dark'

  try {
    // This creates the checkout iframe and returns a Promise
    // that resolves when the checkout is fully loaded
    const checkout = await PolarEmbedCheckout.create(checkoutLink, theme);

    // Now you can interact with the checkout instance
    return checkout;
  } catch (error) {
    console.error("Failed to open checkout", error);
  }
};

// Example: Trigger checkout when a button is clicked
document.getElementById("buy-button").addEventListener("click", () => {
  openCheckout();
});
```

### Listening for checkout events

You can listen for checkout events to respond to user interactions:

```ts  theme={null}
import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";

const openCheckoutWithEvents = async () => {
  const checkout = await PolarEmbedCheckout.create("__CHECKOUT_LINK__");

  // Listen for when the checkout is loaded
  checkout.addEventListener("loaded", (event) => {
    console.log("Checkout loaded");
    // Call event.preventDefault() if you want to prevent the standard behavior
    // event.preventDefault()
    // Note: This would prevent removing the loader if it's still visible
  });

  // Listen for when the checkout has been closed
  checkout.addEventListener("close", (event) => {
    console.log("Checkout has been closed");
    // Call event.preventDefault() if you want to prevent the standard behavior
    // event.preventDefault()
  });

  // Listen for when the checkout has been confirmed (payment processing)
  checkout.addEventListener("confirmed", (event) => {
    console.log("Order confirmed, processing payment");
    // Call event.preventDefault() if you want to prevent the standard behavior
    // event.preventDefault()
    // Note: This would prevent setting the checkout as non-closable
  });

  // Listen for successful completion
  checkout.addEventListener("success", (event) => {
    console.log("Purchase successful!", event.detail);

    // Call event.preventDefault() if you want to prevent the standard behavior
    // event.preventDefault()
    // Note: For success event, this prevents automatic redirection if redirect is true

    // If redirect is false, you can show your own success message
    if (!event.detail.redirect) {
      showSuccessMessage();
    }
    // Otherwise, the user will be redirected to the success URL (unless prevented)
  });

  return checkout;
};
```

### React Integration with event handling

Here's a more complete React example that handles checkout events:

```ts  theme={null}
import { PolarEmbedCheckout } from '@polar-sh/checkout/embed'
import { useState, useEffect } from 'react'

const CheckoutButton = () => {
  const [checkoutInstance, setCheckoutInstance] = useState(null)

  // Clean up checkout instance on unmount
  useEffect(() => {
    return () => {
      if (checkoutInstance) {
        checkoutInstance.close()
      }
    }
  }, [checkoutInstance])

  const handleCheckout = async () => {
      try {
        const checkout = await PolarEmbedCheckout.create(
          '__CHECKOUT_LINK__',
          'light'
        )

      setCheckoutInstance(checkout)

      checkout.addEventListener('success', (event) => {
        // Track successful purchase
        analytics.track('Purchase Completed', {
          productId: 'your-product-id',
          // Add other analytics data
        })

        // Show success message or redirect
        if (!event.detail.redirect) {
          // Handle success in your app
        }
      })

      checkout.addEventListener('close', (event) => {
        // Clean up our reference when checkout is closed
        setCheckoutInstance(null)
      })
    } catch (error) {
      console.error('Failed to open checkout', error)
    }
  }

  return (
    <button onClick={handleCheckout}>
      Complete Purchase
    </button>
  )
}

export default CheckoutButton
```

### Programmatically closing checkout

In some cases, you might need to programmatically close the checkout - for instance, if you detect that a user needs to take an action elsewhere in your application first:

```ts  theme={null}
import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";

// Example: open checkout and store the instance
let activeCheckout = null;

async function openCheckout() {
  const checkout = await PolarEmbedCheckout.create("__CHECKOUT_LINK__");
  activeCheckout = checkout;
  return checkout;
}

// Later, close it programmatically when needed
function closeCheckout() {
  if (activeCheckout) {
    activeCheckout.close();
    // The 'close' event will fire automatically
    // Don't set activeCheckout to null here, as we'll handle that in the event listener
  }
}

// Add a listener to update our reference when checkout is closed
function setupCheckout(checkout) {
  checkout.addEventListener("close", (event) => {
    // Reset our reference when checkout is closed
    activeCheckout = null;
  });
  return checkout;
}

// Example usage
document.getElementById("open-checkout").addEventListener("click", async () => {
  const checkout = await openCheckout();
  setupCheckout(checkout);
});
document
  .getElementById("close-checkout")
  .addEventListener("click", closeCheckout);
```

## Enabling Wallet Payment Methods (Apple Pay, Google Pay, etc.)

Wallet payment methods such as Apple Pay and Google Pay are supported in the checkout with the following conditions:

* **Apple Pay** appears automatically in the checkout if:
  * The user is on an Apple device
  * The browser is Safari
  * The device is connected to an Apple account with Apple Pay configured

* **Google Pay** appears automatically in the checkout if:
  * The user is on Google Chrome
  * The browser is connected to a Google account with Google Pay configured

**No additional action is required** if you meet these conditions and are not using an embedded checkout.

### Enabling Wallet Payments for Embedded Checkout

By default, wallet payment methods (Apple Pay, Google Pay, etc.) are **not enabled** when you embed our checkout form into your website. For security reasons, your website domain needs to be manually validated before enabling these payment methods in embedded mode.

To enable wallet payment methods on your embedded checkout, please [email us](mailto:support@polar.sh) with:

* Your organization slug
* The domain you wish to allow for wallet payments


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://polar.sh/docs/llms.txt