# rate-limiter
Implementation of the most common rate limiting algorithms: Fixed Window, Sliding Window, Leaky Bucket, Token Bucket. To be used as middleware for express applications.

# Instalation
`npm install @roneysilva25/rate-limiter`

or

`yarn add @roneysilva25/rate-limiter`

# Usage
```typescript
import { rateLimiter } from "@roneysilva25/rate-limiter";

const app = express();

const limiter = rateLimiter({
    algorithm: "fixed_window",
    capacity: 100,
    timeWindowInMs: 1000*60*2,
});

app.use(limiter.limit);
```

# Configuration
| Name      | Description  | Default Value | 
------------|--------------|---------------|
| algorithm | The algorithm to be used in the rate limiter. Current options include: `fixed_window`. More algorithms to be included as mentioned in the Roadmap section. | `fixed_window` |
| capacity  | The amount of requests allowed within the specified time window. | 200 |
| timeWindowInMS | The time window, in milliseconds to limit the incoming requests. | 120000 ms (2 minutes) |

# How is the rate limiting applied?
The limit is applied by IP Address. If `req.ip` is undefined, a 400 status response is sent with body "Invalid IP Address.".

# Response Headers
The following headers are added to every response:
| Name | Description |
-------|-------------|
| X-RateLimit-Limit | Represents the configured capacity. |
| X-RateLimit-Remaining | Represents the remaining requests allowed within the current time window |
| X-RateLimit-Reset | Represents, in milliseconds, the remaining time before the current time window restarts. This is calculated using the EPOCH time as a reference. |

When a request is dropped after reaching the limit, a `429 status code` response is sent.

# Time Complexity
How are the remaining limits and time windows stored for each IP Address?

This information is stored in-memory in a hash map data structure with the IP Address as the key. This provides O(1) time complexity for lookups and insertions.

# Roadmap 
Future plans include:
- Implemeting more rate limiting algorithms.
- Add integration with Redis.

`Made by: Roney Diego` 

