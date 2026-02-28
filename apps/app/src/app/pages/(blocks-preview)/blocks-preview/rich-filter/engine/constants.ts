import type { FocusOrigin } from '@angular/cdk/a11y';

/**
 * This constant is used to replace with the query signal
 * in the combo async field resource request.
 *
 * The logic will search in url of the HttpResourceRequest
 * for this token ans replace it with the current
 * value of the text in the combobox
 *
 * The user can use this token in the url property like this:
 *
 * ```javascript
 * url: 'https://my-api.com/search?query=' + QueryToken
 * url: `https://my-api.com/users/${QueryToken}/books`
 * ```
 *
 * Params replacement are not supported yet
 *
 *
 * The engine won't scan any other properties of the request
 * so if you put the token in a different property
 * it won't be replaced and the request will be sent
 * with the value "HTTP_RESOURCE_QUERY_TOKEN"
 */
export const QueryToken = 'HTTP_RESOURCE_QUERY_TOKEN';

/**
 * This constant is used as a fallback focus target when removing fields
 */
export const FOCUS_FALLBACK = 'FOCUS_FALLBACK';

export const FAKE_FOCUS_ORIGIN = 'program' satisfies FocusOrigin;
