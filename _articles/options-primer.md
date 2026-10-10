---
title: "Options, from Scratch"
subtitle: "What a call and a put are, why they cost what they cost, and how they actually change hands."
topic: finance
tags: [options, derivatives, black-scholes, risk-neutral-pricing, market-structure]
reading_time: 30
date: 2026-10-10
level: intro
summary: "A beginner's primer on stock options for readers comfortable with math and code. Covers calls, puts, and payoff diagrams; intrinsic and time value; pricing by replication, the binomial model, and Black–Scholes; the Greeks and implied volatility; and the mechanics of trading: option chains, exchanges, the clearing house, exercise, assignment, and margin. Ends with common strategies and the ways beginners lose money."
brief: "Create a 30-minute read on options: what they are and how they are traded. Beginner level in finance; the reader is comfortable with math and coding."
references:
  - title: "J. C. Hull. Options, Futures, and Other Derivatives. Pearson (11th ed., 2021)."
    note: "The standard textbook. Chapters 10–15 and 19 cover everything here in more depth."
  - title: "S. Natenberg. Option Volatility and Pricing, 2nd ed. McGraw-Hill (2015)."
    note: "Written from a trader's point of view; good on the Greeks and volatility."
  - title: "F. Black & M. Scholes (1973). The Pricing of Options and Corporate Liabilities. Journal of Political Economy 81(3), 637–654."
  - title: "R. C. Merton (1973). Theory of Rational Option Pricing. Bell Journal of Economics and Management Science 4(1), 141–183."
  - title: "J. C. Cox, S. A. Ross & M. Rubinstein (1979). Option Pricing: A Simplified Approach. Journal of Financial Economics 7(3), 229–263."
    note: "The binomial model used in this article."
  - title: "Options Clearing Corporation. Characteristics and Risks of Standardized Options (the Options Disclosure Document)."
    url: https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document
    note: "The document every US broker must give you before you can trade options. Dry, but authoritative on the mechanics."
  - title: "S. E. Shreve. Stochastic Calculus for Finance I: The Binomial Asset Pricing Model. Springer (2004)."
    note: "The rigorous version of the replication argument, if you want the measure theory."
---

Suppose a stock trades at \$100 today and you believe it will rise over the next three months. You could buy a share for \$100. Or you could pay someone about \$4 today for the *right*, but not the obligation, to buy a share from them for \$105 at any point in the next three months. If the stock ends at \$120, you exercise, buy at \$105, and the right was worth \$15, almost four times what you paid. If the stock ends at \$95, you simply let the right expire. You lose the \$4 and nothing more.

That right is a **call option**. It is a contract whose value is derived from the price of something else, which is why options belong to the family called **derivatives**. This article explains what options are, how their payoffs work, where their prices come from (the part where your math background pays off), and how they are bought and sold in practice. No finance background is assumed. Where code appears, it was run and the output shown is real.

> This is an educational article, not investment advice. Options are leveraged instruments, and buyers frequently lose their entire premium.
{: .warning}

## The two basic contracts

An option is a contract between two parties: a **buyer** (also called the *holder*, or the *long* side) and a **seller** (also called the *writer*, or the *short* side). The buyer pays the seller a price up front, called the **premium**. In exchange, the buyer receives a right and the seller takes on a matching obligation.

> **Call option.** The right to *buy* a specified asset (the **underlying**) at a specified price (the **strike price**, $$K$$) on or before a specified date (the **expiration date**, $$T$$).
>
> **Put option.** The right to *sell* the underlying at the strike price on or before the expiration date.
{: .definition}

Using the right is called **exercising** the option. When a buyer exercises, the seller is **assigned** and must fulfil the obligation: deliver shares at $$K$$ (for a call) or buy shares at $$K$$ (for a put).

Some fixed vocabulary goes with these definitions.

- **Underlying.** The asset the option refers to. In this article it is usually a stock, but options also exist on stock indices (like the S&P 500), exchange-traded funds, futures, currencies, and commodities.
- **Contract multiplier.** One standard US equity option contract covers **100 shares**. Prices are quoted *per share*, so a quoted premium of \$4.32 means one contract costs \$432.
- **Exercise style.** An **American** option can be exercised on any business day up to expiration. A **European** option can only be exercised at expiration. The names refer to the style and have nothing to do with geography. Options on individual US stocks are American. Many index options, such as those on the S&P 500 index (ticker SPX), are European.
- **Settlement.** Stock options are **physically settled**: exercise means shares actually change hands. Index options are **cash settled**: you can't deliver "one S&P 500", so the seller pays the buyer the difference between the index level and the strike in cash.

A call resembles a deposit that locks in a purchase price you can walk away from; a put resembles an insurance policy on something you own. Both capture the key asymmetry: **the buyer's loss is limited to the premium, while the seller's potential loss can be much larger.**

## Payoffs at expiration

A call with strike $$K$$ is worth exercising only if $$S_T > K$$. In that case you buy at $$K$$ something worth $$S_T$$, gaining $$S_T - K$$. Otherwise it is worthless. So the **payoff** of a call is

$$
\text{call payoff} = \max(S_T - K,\, 0) = (S_T - K)^+ .
$$

By the same reasoning, a put lets you sell at $$K$$ something worth $$S_T$$, so

$$
\text{put payoff} = \max(K - S_T,\, 0) = (K - S_T)^+ .
$$

*Payoff* ignores what you paid. **Profit** subtracts the premium. If $$c$$ is the call premium, the buyer's profit at expiration is $$(S_T - K)^+ - c$$. Ignoring the small effect of interest on the premium, the seller's profit is exactly the negative of this. Options are a **zero-sum** contract between the two parties. Every dollar one side makes, the other side loses.

There are four basic positions: long call, short call, long put, short put. The figure below shows their profit at expiration for a strike of \$100 and a premium of \$5.

<div class="chart">
<script type="application/vnd.vegalite+json">
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": {"sequence": {"start": 60, "stop": 140.5, "step": 0.5, "as": "S"}},
  "transform": [
    {"calculate": "max(datum.S - 100, 0) - 5", "as": "Long call"},
    {"calculate": "5 - max(datum.S - 100, 0)", "as": "Short call"},
    {"calculate": "max(100 - datum.S, 0) - 5", "as": "Long put"},
    {"calculate": "5 - max(100 - datum.S, 0)", "as": "Short put"},
    {"fold": ["Long call", "Short call", "Long put", "Short put"], "as": ["position", "profit"]}
  ],
  "facet": {"field": "position", "type": "nominal", "sort": ["Long call", "Short call", "Long put", "Short put"], "title": null},
  "columns": 2,
  "spec": {
    "width": 260,
    "height": 150,
    "layer": [
      {"mark": {"type": "rule", "strokeDash": [4, 4], "opacity": 0.5}, "encoding": {"y": {"datum": 0}}},
      {"mark": {"type": "line", "strokeWidth": 2.5},
       "encoding": {
         "x": {"field": "S", "type": "quantitative", "title": "Stock price at expiration ($)"},
         "y": {"field": "profit", "type": "quantitative", "title": "Profit per share ($)", "scale": {"domain": [-40, 40]}}
       }}
    ]
  }
}
</script>
<p class="chart-caption">Profit at expiration for strike $100 and premium $5. The long call's upside is unlimited; the short call's downside is unlimited. The long put's best case is $95 (the stock goes to zero). Each short position is the mirror image of the corresponding long.</p>
</div>

Three things to read off these "hockey stick" diagrams:

1. **Break-even.** A long call makes money only if $$S_T > K + c$$. Here that is \$105. A long put needs $$S_T < K - p$$, here \$95. The stock must move *enough*, not merely in the right direction.
2. **Asymmetry.** Buyers have limited loss and large (for calls, unlimited) potential gain. Sellers have the reverse: their best case is keeping the premium, and their worst case is large. Sellers accept this because they are paid for bearing that risk.
3. **Kinks.** The payoff is piecewise linear with a kink at the strike. That kink is why the option has value before expiry: the function $$x \mapsto (x - K)^+$$ is *convex*, and by Jensen's inequality $$\mathbb{E}[(S_T - K)^+] \ge (\mathbb{E}[S_T] - K)^+$$. Uncertainty about where the stock ends up increases the expected payoff of a convex claim. This is the single most important idea in option pricing, and we'll come back to it.

### Leverage

Return to the opening example: stock at \$100, a three-month call with strike \$105 costing \$4.32. Compare buying one share with buying the call.

| Stock at expiry | Share: return | Call payoff | Call: return |
|---:|---:|---:|---:|
| \$90 | −10% | \$0 | −100% |
| \$100 | 0% | \$0 | −100% |
| \$110 | +10% | \$5 | +16% |
| \$120 | +20% | \$15 | +247% |

The call magnifies percentage outcomes in both directions, and a flat stock, which costs the shareholder nothing, wipes out the call buyer. This is what **leverage** means here.

## Moneyness, intrinsic value, and time value

Before expiration an option's price has two parts.

**Intrinsic value** is what the option would pay if exercised right now: $$(S - K)^+$$ for a call and $$(K - S)^+$$ for a put, where $$S$$ is today's stock price. It can never be negative.

**Time value** (also called *extrinsic value*) is everything else:

$$
\text{premium} = \text{intrinsic value} + \text{time value}.
$$

Time value is the price of the *possibility* that the stock moves further in your favour before expiration, while your losses stay capped. It is largest when the stock is near the strike, shrinks as expiration approaches, and is exactly zero at expiration.

Traders describe where the stock sits relative to the strike using **moneyness**:

| Term | Call | Put | Intrinsic value |
|---|---|---|---|
| In the money (ITM) | $$S > K$$ | $$S < K$$ | positive |
| At the money (ATM) | $$S \approx K$$ | $$S \approx K$$ | about zero |
| Out of the money (OTM) | $$S < K$$ | $$S > K$$ | zero |

An OTM option is made entirely of time value. The \$105 call in our example, with the stock at \$100, is OTM: its \$4.32 is pure time value. A \$90 call on the same stock is ITM with \$10 of intrinsic value and costs about \$12.69, so its time value is \$2.69.

> **A practical consequence.** Because time value is always non-negative, an American call on a stock that pays no dividends is worth at least its intrinsic value while it is alive, and selling it captures that time value while exercising throws it away. So it is never optimal to exercise such a call early. If you want out, sell the option. (Dividends and deep-ITM puts are exceptions; see the section on exercise.)
{: .key}

## Where option prices come from

Here is the natural first guess at a price: the option is worth its expected payoff, discounted to today. For a call,

$$
c \stackrel{?}{=} e^{-rT}\, \mathbb{E}\big[(S_T - K)^+\big],
$$

where $$r$$ is the interest rate. But expected under *whose* probabilities? Investors disagree about where the stock is headed. The surprising answer of option theory is that, in an idealised market, the price does **not** depend on anyone's view of the stock's direction. It is fixed by *replication* and *no arbitrage*.

> **Arbitrage** is a strategy that costs nothing (or less than nothing) today, can never lose money, and has some chance of making money. The **no-arbitrage principle** says such free lunches don't persist. Consequence: two portfolios that have identical payoffs in every future state must have the same price today.
{: .definition}

### The one-step binomial model

A stock is at \$100 today. In one period it will be either \$120 (up) or \$80 (down). To keep the arithmetic clean, take the interest rate to be zero. What is a call with strike \$100, expiring at the end of the period, worth?

Its payoff is \$20 in the up state and \$0 in the down state. Now try to build a portfolio from things we *can* price, shares and cash, that pays exactly the same. Hold $$\Delta$$ shares and $$B$$ dollars of cash (negative $$B$$ means borrowing). We need

$$
\begin{aligned}
120\,\Delta + B &= 20 \quad\text{(up)}\\
80\,\Delta + B &= 0 \quad\text{(down)}.
\end{aligned}
$$

Subtracting gives $$40\Delta = 20$$, so $$\Delta = 0.5$$, and then $$B = -40$$. The portfolio "buy half a share, borrow \$40" pays \$20 if up and \$0 if down, which is exactly the call's payoff. It costs $$0.5 \times 100 - 40 = \$10$$ today. By no arbitrage, **the call is worth \$10**.

If the call traded at \$12, you could sell it, buy the replicating portfolio for \$10, and pocket \$2 risk-free; at \$8, do the reverse.

Notice what didn't appear in this calculation: **the probability that the stock goes up**. Whether the up move has probability 0.1 or 0.9, the replication cost is \$10. Beliefs about direction are already in the stock price; the option is pinned to that, not to your forecast.

### Risk-neutral probabilities

Repackage the argument: ask what probability $$q$$ of the up move would make the stock's expected return equal to the risk-free rate (zero here):

$$
q \cdot 120 + (1 - q)\cdot 80 = 100 \quad\Longrightarrow\quad q = 0.5.
$$

Now compute the option's expected payoff using $$q$$: $$0.5 \times 20 + 0.5 \times 0 = 10$$. Same answer. This is not a coincidence. With a general rate $$r$$ and up/down factors $$u$$ and $$d$$ over a period of length $$\Delta t$$,

$$
q = \frac{e^{r\Delta t} - d}{u - d},
\qquad
\text{price} = e^{-r\Delta t}\big[q\,V_{\text{up}} + (1 - q)\,V_{\text{down}}\big].
$$

The number $$q$$ is called the **risk-neutral probability**, and the distribution it defines is the **risk-neutral measure**, often written $$\mathbb{Q}$$. It is not anyone's belief but a calculating device: *the price of any derivative equals its discounted expected payoff under the probability that makes every asset earn the risk-free rate.* This resolves the "which expectation?" puzzle from the start of the section:

$$
c = e^{-rT}\,\mathbb{E}^{\mathbb{Q}}\big[(S_T - K)^+\big].
$$

> **Fundamental theorem of asset pricing (informal).** A market model has no arbitrage if and only if there is a risk-neutral probability measure under which discounted asset prices are martingales. If, in addition, every payoff can be replicated (the market is *complete*), that measure is unique and so is every derivative's price.
{: .theorem}

If you have met martingales in sequential analysis or online learning, this is the same object: under $$\mathbb{Q}$$, the discounted stock price is a fair game.

### Many steps: the binomial tree

Now chain many small steps. Over $$n$$ steps the stock can end at $$n+1$$ different prices, and we price the option by working backwards from expiration, applying the one-step formula at every node. Choosing $$u = e^{\sigma\sqrt{\Delta t}}$$ and $$d = 1/u$$ makes the tree's variance match a stock with **volatility** $$\sigma$$, the annualised standard deviation of its log returns. This is the Cox–Ross–Rubinstein model.

```python
from math import log, sqrt, exp, erf

def N(x):                                     # standard normal CDF
    return 0.5 * (1 + erf(x / sqrt(2)))

def bs_call(S, K, T, r, sigma):               # Black–Scholes (next section)
    d1 = (log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * sqrt(T))
    d2 = d1 - sigma * sqrt(T)
    return S * N(d1) - K * exp(-r * T) * N(d2)

def binomial_call(S, K, T, r, sigma, n):
    dt = T / n
    u = exp(sigma * sqrt(dt)); d = 1 / u
    q = (exp(r * dt) - d) / (u - d)           # risk-neutral probability
    values = [max(S * u**j * d**(n - j) - K, 0) for j in range(n + 1)]
    for _ in range(n):                        # roll back through the tree
        values = [exp(-r * dt) * (q * values[j + 1] + (1 - q) * values[j])
                  for j in range(len(values) - 1)]
    return values[0]

S, K, T, r, sigma = 100, 105, 0.25, 0.04, 0.30
print(f"Black-Scholes call: {bs_call(S, K, T, r, sigma):.4f}")
for n in [1, 2, 10, 100, 1000]:
    print(f"binomial, n={n:>4}: {binomial_call(S, K, T, r, sigma, n):.4f}")
```

```text
Black-Scholes call: 4.3215
binomial, n=   1: 5.4912
binomial, n=   2: 4.5580
binomial, n=  10: 4.4625
binomial, n= 100: 4.3336
binomial, n=1000: 4.3213
```

As the number of steps grows, the binomial price converges to a closed-form limit. That limit is the Black–Scholes formula. Taking the maximum of continuation and immediate-exercise value at each node prices American options too, which is why trees remain in wide use.

### The Black–Scholes formula

In 1973 Fischer Black and Myron Scholes, with Robert Merton, derived the continuous-time limit directly. They modelled the stock as geometric Brownian motion, meaning its log returns are normally distributed with volatility $$\sigma$$, and replicated the option with a continuously rebalanced position in the stock and cash. Scholes and Merton received the 1997 Nobel memorial prize in economics for this work; Black had died in 1995. For a European call on a non-dividend-paying stock:

$$
c = S\,N(d_1) - K e^{-rT} N(d_2),
\qquad
d_{1,2} = \frac{\ln(S/K) + (r \pm \tfrac12\sigma^2)T}{\sigma\sqrt{T}},
$$

where $$N$$ is the standard normal CDF. It is exactly $$e^{-rT}\mathbb{E}^{\mathbb{Q}}[(S_T - K)^+]$$ when $$\ln S_T$$ is normal with mean $$\ln S + (r - \tfrac12\sigma^2)T$$ and variance $$\sigma^2 T$$ under $$\mathbb{Q}$$. The two terms have readable meanings: $$N(d_2)$$ is the risk-neutral probability that the call finishes in the money, and $$S\,N(d_1)$$ is the discounted risk-neutral expected value of the stock *on the event* that it does.

The formula has five inputs:

| Input | Symbol | Effect of increasing it on a call | …on a put |
|---|---|---|---|
| Stock price | $$S$$ | ↑ | ↓ |
| Strike | $$K$$ | ↓ | ↑ |
| Time to expiry | $$T$$ | ↑ | usually ↑ |
| Volatility | $$\sigma$$ | ↑ | ↑ |
| Interest rate | $$r$$ | ↑ | ↓ |

Four are observable. **Volatility is not**: it describes how much the stock *will* move, which is unknown. This one input drives how options are actually quoted and traded.

A handy rule of thumb follows from expanding the formula around $$S = K$$ with small $$r$$: an at-the-money option is worth roughly

$$
c_{\text{ATM}} \approx 0.4\,\sigma\, S\sqrt{T},
$$

since $$1/\sqrt{2\pi} \approx 0.4$$. For $$S = 100$$, $$\sigma = 0.3$$, three months: $$0.4 \times 0.3 \times 100 \times 0.5 = 6$$. The exact Black–Scholes value is \$6.46, with the gap mostly due to the 4% interest rate. Value scales linearly in volatility and with the *square root* of time.

### Put–call parity

Calls and puts with the same strike and expiry are linked by a model-free relation. Consider two portfolios:

- **A:** one European call plus cash $$K e^{-rT}$$ (which grows to $$K$$ by expiry).
- **B:** one European put plus one share.

At expiry, A is worth $$(S_T - K)^+ + K = \max(S_T, K)$$, and B is worth $$(K - S_T)^+ + S_T = \max(S_T, K)$$. They are identical in every state, so by no arbitrage they cost the same today:

$$
c + K e^{-rT} = p + S .
$$

This requires no assumption about how the stock moves. With our numbers, $$c - p = 4.3215 - 8.2767 = -3.955$$ and $$S - Ke^{-rT} = 100 - 105e^{-0.01} = -3.955$$. Parity also explains a fact that surprises beginners: a call and a put at the same strike carry the same time value up to interest effects. Neither is inherently "the cheap one".

> **Why buy options, then?** In the idealised model an option is worth exactly what it costs to manufacture, so no one has an edge. In reality stocks jump, hedging is neither continuous nor free, and nobody knows future volatility. Buyers pay for convexity (crash insurance, or a lottery-like payoff); sellers want compensation for the tail risk. For broad equity indices, implied volatility has on average exceeded the volatility that followed. This gap is the **volatility risk premium**, and it means index put buyers have, on average, paid for their insurance much as insurance customers do.
{: .aside}

## Volatility, the Greeks, and how prices move

### Implied volatility

Since $$\sigma$$ is the only unobservable input and the call price is strictly increasing in $$\sigma$$, you can invert the formula: given a market price, solve for the $$\sigma$$ that reproduces it. That number is the **implied volatility** (IV). If our \$105 call trades at \$4.00 instead of \$4.32, bisection on the formula gives an implied volatility of 28.4%.

Traders compare options in IV rather than dollars, since IV normalises away strike, time, and price level; "expensive" means "high IV relative to the move I expect". In this sense, *trading options is largely trading volatility.*

If Black–Scholes were exactly right, every option on the same stock would have the same IV. They don't. Plotting IV against strike typically gives a curve, the **volatility smile** or, for equity indices, a downward-sloping **skew**: OTM puts carry higher IV than OTM calls. The market charges more for crash insurance than a lognormal model would, reflecting the fat left tail of real returns.

### The Greeks

The sensitivities of the price to each input are the **Greeks**. Here they are for our running example, the \$105 call with three months left, stock at \$100, $$\sigma = 30\%$$, $$r = 4\%$$:

| Greek | Definition | Meaning | Value |
|---|---|---|---:|
| Delta $$\Delta$$ | $$\partial c / \partial S$$ | \$ change per \$1 move in the stock | 0.427 |
| Gamma $$\Gamma$$ | $$\partial^2 c / \partial S^2$$ | change in delta per \$1 move | 0.026 |
| Theta $$\Theta$$ | $$\partial c / \partial t$$ | \$ change per day that passes | −0.036 |
| Vega $$\nu$$ | $$\partial c / \partial \sigma$$ | \$ change per 1 point of volatility | 0.196 |
| Rho $$\rho$$ | $$\partial c / \partial r$$ | \$ change per 1 point of interest rate | 0.096 |

Each number is per share; multiply by 100 for a contract. So this contract loses about \$3.64 a day to the passage of time if nothing else changes, and gains about \$19.60 if implied volatility rises from 30% to 31%.

**Delta**, the slope with respect to the stock, ranges from 0 to 1 for calls (−1 to 0 for puts). It is also the hedge ratio: our one-step example's $$\Delta = 0.5$$ was exactly the delta. Traders loosely read it as the chance of finishing in the money ($$N(d_2)$$ is the exact risk-neutral version): a 0.10-delta option is a long shot.

**Gamma** is the curvature, the Greek that captures the convexity we keep returning to. Long options have positive gamma: as the stock rises, your delta rises, so you gain more and more; as it falls, your delta shrinks and losses slow down. You pay for that with **theta**. In the Black–Scholes model, with $$\Theta$$ measured per year,

$$
\Theta + \tfrac12 \sigma^2 S^2\, \Gamma = r\,(\text{option value} - \Delta S),
$$

which with small $$r$$ says that time decay is the price of gamma. An option buyer is betting that the stock will move more than the implied volatility suggests. A seller is betting it will move less.

**Theta** is not constant. Time value decays slowly at first and then quickly near expiry, roughly like $$\sqrt{T}$$. Drag the slider to see how an at-the-money option's value collapses in the final weeks.

<div class="chart">
<script type="application/vnd.vegalite+json">
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "height": 240,
  "params": [
    {"name": "vol", "value": 0.3, "bind": {"input": "range", "min": 0.1, "max": 0.8, "step": 0.05, "name": "volatility σ "}}
  ],
  "data": {"sequence": {"start": 0, "stop": 90.5, "step": 0.5, "as": "days"}},
  "transform": [
    {"calculate": "max(datum.days, 0.0001) / 365", "as": "T"},
    {"calculate": "(0.04 + 0.5 * vol * vol) * datum.T / (vol * sqrt(datum.T))", "as": "d1"},
    {"calculate": "datum.d1 - vol * sqrt(datum.T)", "as": "d2"},
    {"calculate": "100 * cumulativeNormal(datum.d1) - 100 * exp(-0.04 * datum.T) * cumulativeNormal(datum.d2)", "as": "value"}
  ],
  "mark": {"type": "line", "strokeWidth": 2.5},
  "encoding": {
    "x": {"field": "days", "type": "quantitative", "title": "Days to expiration", "scale": {"reverse": true}},
    "y": {"field": "value", "type": "quantitative", "title": "Call value ($)", "scale": {"domain": [0, 18]}},
    "tooltip": [{"field": "days", "title": "days left"}, {"field": "value", "format": ".2f", "title": "value ($)"}]
  }
}
</script>
<p class="chart-caption">Value of an at-the-money call (S = K = $100, r = 4%) as expiration approaches; time runs left to right. At 30% volatility it is worth $6.41 with 90 days left, $3.59 with 30, $2.03 with 10, and $0.63 with one. Losing a third of the remaining time costs much more near the end.</p>
</div>

**Vega** matters most around scheduled events. Before a company reports earnings, implied volatility rises because a big move is possible; immediately after, it collapses. This is called **IV crush**. Concretely: an ATM call with 30 days left priced at 60% IV is worth \$7.01. Suppose earnings come out, the stock rises \$3, and IV falls to 35%. The call is now worth \$5.86. You were right about the direction and still lost 16%.

## How options are traded

This section covers the plumbing of the US listed market, the largest; other markets work similarly.

### Listed versus over-the-counter

**Listed** options have standardised terms set by the exchanges and trade publicly. **Over-the-counter** (OTC) options are private contracts between institutions with any terms they like. Individual investors trade listed options. Standardisation is what made a mass market possible: the Chicago Board Options Exchange (now Cboe) opened in April 1973, the year the Black–Scholes paper appeared, as the first exchange for listed stock options. Today there are over a dozen US options exchanges, and volume has run to more than ten billion contracts a year.

### The clearing house

When you buy an option on an exchange, your counterparty is not really the stranger who sold it. Once a trade is matched, the **Options Clearing Corporation** (OCC) steps in between the two sides and becomes the buyer to every seller and the seller to every buyer. Your contract is with the OCC.

<div class="flow">
<div class="flow-box flow-box--ghost"><b>You</b>Place an order in your brokerage account, e.g. "buy 1 XYZ Jan 105 call, limit $4.30".</div>
<div class="flow-arrow">routes order</div>
<div class="flow-box"><b>Broker</b>Checks you're approved for options and have enough cash or margin, then sends the order to an exchange or to a market maker.</div>
<div class="flow-arrow">matched with a seller</div>
<div class="flow-box"><b>Exchange</b>Matches buyers and sellers. Market makers continuously post bids and offers so there is usually someone to trade with.</div>
<div class="flow-arrow">trade reported for clearing</div>
<div class="flow-box flow-box--accent"><b>Options Clearing Corporation</b>Becomes counterparty to both sides, collects margin from sellers through their brokers, and processes exercises and assignments.</div>
<p class="chart-caption">The life of an options order. Because the OCC guarantees every contract, a buyer doesn't need to trust whoever happened to sell.</p>
</div>

So you never need to trust your counterparty, and positions are *fungible*: to exit, you sell an identical contract to anyone, and the two cancel at the OCC. Hence the order-ticket vocabulary **buy to open / sell to close** (a long position) and **sell to open / buy to close** (a short one). **Open interest** counts contracts currently outstanding; **volume** counts contracts traded today.

### Naming a contract

A contract is identified by underlying, expiration, strike, and type, e.g. "XYZ 18 Dec 2026 105 Call". The OCC's symbol uses a fixed-width symbol: the root ticker padded to six characters, the expiry as YYMMDD, `C` or `P`, and the strike times 1000 as eight digits.

```text
XYZ   261218C00105000
└─┬──┘└─┬──┘│└──┬───┘
 root  expiry│  strike = 105.000
     2026-12-18  C = call
```

**Expirations.** Standard monthly options expire on the third Friday of the month. Many underlyings also have **weekly** expirations, and the most active index and ETF products (SPX, SPY) list one every trading day. Options traded on their final day, called **0DTE**, are now a large share of index volume; they are extremely high-gamma, high-theta instruments.

**Strikes** are listed at regular intervals around the current price, such as every \$1, \$2.50, or \$5, depending on the stock's price and liquidity. New strikes are added as the stock moves.

### Reading an option chain

Brokers show the contracts for one expiration as an **option chain**: one row per strike, calls on one side, puts on the other. Below is an illustrative chain for a fictional stock XYZ at \$100, three months out. Mid prices are Black–Scholes values at 30% volatility; the bid–ask widths are invented.

| Call bid | Call ask | Call Δ | **Strike** | Put bid | Put ask | Put Δ |
|---:|---:|---:|:---:|---:|---:|---:|
| 12.55 | 12.85 | 0.80 | **90** | 1.74 | 1.84 | −0.20 |
| 9.15 | 9.35 | 0.69 | **95** | 3.25 | 3.35 | −0.31 |
| 6.40 | 6.52 | 0.56 | **100** | 5.40 | 5.52 | −0.44 |
| 4.26 | 4.38 | 0.43 | **105** | 8.15 | 8.40 | −0.57 |
| 2.72 | 2.82 | 0.31 | **110** | 11.50 | 11.85 | −0.69 |

- **Bid and ask.** The **bid** is the best price a buyer will pay; the **ask** is the best price a seller will accept. Buying at the ask and selling at the bid costs the **spread** on every round trip: \$12 per contract on the 105 call. Spreads are wide in thinly traded contracts.
- **Call delta minus put delta is 1** at each strike: put–call parity differentiated with respect to $$S$$.

### Placing an order

- **Use limit orders.** A market order fills at whatever price is available, which with wide spreads can be poor. A limit order sets the worst price you'll accept; start near the mid.
- **Market makers** are firms obligated by exchange rules to post two-sided quotes. They earn the spread and hedge by trading the stock to stay roughly delta-neutral: the replication argument run as a business. Your counterparty is very often one of them.
- **Multi-leg orders** send a spread as one order at a net price, so the legs fill together or not at all.
- **Costs.** Besides the spread, there may be a per-contract commission and small regulatory fees.

### Exercise, assignment, and expiration

Most positions are closed by trading, since selling captures time value and exercising throws it away. Still, you need to know what happens at the end.

**At expiration**, the OCC automatically exercises any equity option that is in the money by at least \$0.01 at the close, unless the holder's broker instructs otherwise. So an ITM call held into expiration becomes 100 shares per contract, which you must pay $$100 \times K$$ for. If you don't want the shares, close the position before the last trading day ends. Cash-settled index options just pay the in-the-money amount.

**Assignment** is the seller's side. The OCC assigns each exercise to a broker with a short position, which allocates it to a customer (randomly or first-in-first-out). An assigned short call must deliver 100 shares at the strike, leaving you short the stock if you don't own them; an assigned short put must buy 100 shares.

**Early assignment** can happen at any time on American options, but it is uncommon except in two situations: a call that is deep in the money just before the stock pays a dividend (the holder exercises to receive the dividend), and a deep ITM put whose remaining time value is less than the interest the holder could earn on the strike.

**Pin risk** arises when the stock closes almost exactly at your short strike: you won't know until after the close whether you'll be assigned.

### Margin and approval levels

A buyer's risk is limited to the premium, so buyers just pay it in full. US rules generally don't allow you to borrow to buy options with nine months or less to expiry.

Sellers must post **margin**, collateral against losses:

- **Covered call:** the 100 shares you own cover the obligation.
- **Cash-secured put:** you set aside $$100 \times K$$ in cash.
- **Naked short options:** a formula-based amount that rises as the trade moves against you. If you can't meet a **margin call**, the broker may close your positions.

Because the risks differ so much, brokers grant options permissions in tiers, after giving you the OCC's *Characteristics and Risks of Standardized Options* booklet. Typically the lowest tier allows covered calls and cash-secured puts, then buying options, then spreads, and the highest allows naked selling.

## Combining options: a few standard strategies

Payoffs add. A portfolio's payoff at expiration is the sum of its legs' payoffs, so you can sculpt almost any piecewise-linear shape from calls, puts, and shares. A handful of combinations have names. Use the explorer to see each one. The solid line is profit at expiration, and the dashed line is the position's profit *today*, valued by Black–Scholes, with the chosen days remaining and volatility. All positions are entered with 60 days to expiry at 30% volatility, with the stock at \$100.

<div class="chart widget" data-no-annotate="">
<div class="widget-row">
<span class="select"><label for="op-strat">Strategy</label>
<select id="op-strat">
<option value="lc">Long call (K = 100)</option>
<option value="lp">Long put (K = 100)</option>
<option value="sc">Short call (K = 100)</option>
<option value="sp">Short put (K = 100)</option>
<option value="cc">Covered call (stock, −C 110)</option>
<option value="pp">Protective put (stock, +P 90)</option>
<option value="bcs">Bull call spread (+C 100, −C 110)</option>
<option value="str">Long straddle (+C 100, +P 100)</option>
<option value="ic">Iron condor (+P 85, −P 90, −C 110, +C 115)</option>
</select></span>
</div>
<div class="widget-row">
<label for="op-days">Days remaining: <strong id="op-daysval">30</strong></label>
<input type="range" id="op-days" min="0" max="60" step="1" value="30">
<label for="op-vol">Volatility now: <strong id="op-volval">30%</strong></label>
<input type="range" id="op-vol" min="10" max="80" step="1" value="30">
</div>
<canvas id="op-cv"></canvas>
<output id="op-out" aria-live="polite"></output>
<p class="chart-caption">Profit per share (multiply by 100 per contract) against the stock price. Solid: at expiration. Dashed: today, given the days remaining and volatility you set. Move the days slider toward 0 to watch the dashed curve settle onto the hockey stick; raise volatility to see which positions gain from bigger expected moves (long gamma) and which lose (short gamma).</p>
</div>

<script>
(function () {
  var cv = document.getElementById('op-cv'), ctx = cv.getContext('2d');
  var sel = document.getElementById('op-strat');
  var dIn = document.getElementById('op-days'), vIn = document.getElementById('op-vol');
  var dOut = document.getElementById('op-daysval'), vOut = document.getElementById('op-volval');
  var out = document.getElementById('op-out');
  var article = document.querySelector('article.article') || document.documentElement;
  var R = 0.04, T0 = 60 / 365, V0 = 0.30, S0 = 100, XMIN = 60, XMAX = 140;
  var STRATS = {
    lc: [['C', 100, 1]], lp: [['P', 100, 1]], sc: [['C', 100, -1]], sp: [['P', 100, -1]],
    cc: [['S', 0, 1], ['C', 110, -1]], pp: [['S', 0, 1], ['P', 90, 1]],
    bcs: [['C', 100, 1], ['C', 110, -1]], str: [['C', 100, 1], ['P', 100, 1]],
    ic: [['P', 85, 1], ['P', 90, -1], ['C', 110, -1], ['C', 115, 1]]
  };
  function N(x) {           // standard normal CDF (Abramowitz–Stegun 7.1.26 via erf)
    var s = x < 0 ? -1 : 1, z = Math.abs(x) / Math.SQRT2, t = 1 / (1 + 0.3275911 * z);
    var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z);
    return 0.5 * (1 + s * y);
  }
  function price(type, S, K, T, v) {
    if (type === 'S') return S;
    if (T <= 1e-9) return type === 'C' ? Math.max(S - K, 0) : Math.max(K - S, 0);
    var sq = v * Math.sqrt(T), d1 = (Math.log(S / K) + (R + 0.5 * v * v) * T) / sq, d2 = d1 - sq;
    var c = S * N(d1) - K * Math.exp(-R * T) * N(d2);
    return type === 'C' ? c : c - S + K * Math.exp(-R * T);
  }
  function value(legs, S, T, v) {
    var tot = 0; legs.forEach(function (l) { tot += l[2] * price(l[0], S, l[1], T, v); }); return tot;
  }
  function css(el, name) { return getComputedStyle(el).getPropertyValue(name).trim(); }
  function fmt(x) { return (x < 0 ? '−$' : '$') + Math.abs(x).toFixed(2); }

  function draw() {
    var legs = STRATS[sel.value], days = +dIn.value, vol = +vIn.value / 100;
    dOut.textContent = days; vOut.textContent = vIn.value + '%';
    var cost = value(legs, S0, T0, V0), T = days / 365;
    var xs = [], ex = [], now = [];
    for (var S = XMIN; S <= XMAX + 1e-9; S += 0.5) {
      xs.push(S); ex.push(value(legs, S, 0, vol) - cost); now.push(value(legs, S, T, vol) - cost);
    }
    var lo = Math.min.apply(null, ex.concat(now)), hi = Math.max.apply(null, ex.concat(now));
    var pad = Math.max(1, 0.1 * (hi - lo)); lo -= pad; hi += pad;

    var root = document.documentElement, dpr = window.devicePixelRatio || 1;
    var w = cv.clientWidth, h = cv.clientHeight; if (!w) return;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    var L = 46, Rm = 12, Tp = 10, B = 26;
    function X(s) { return L + (w - L - Rm) * (s - XMIN) / (XMAX - XMIN); }
    function Y(p) { return Tp + (h - Tp - B) * (1 - (p - lo) / (hi - lo)); }
    var muted = css(root, '--muted'), grid = css(root, '--border');
    var line = css(article, '--topic') || css(root, '--accent'), accent = css(root, '--accent') || line;
    ctx.font = '12px ' + css(root, '--font-sans'); ctx.lineWidth = 1;
    var step = Math.pow(10, Math.floor(Math.log10((hi - lo) / 4)));
    if ((hi - lo) / step > 10) step *= 2; if ((hi - lo) / step > 10) step *= 2.5;
    ctx.fillStyle = muted; ctx.strokeStyle = grid; ctx.textAlign = 'right';
    for (var g = Math.ceil(lo / step) * step; g <= hi; g += step) {
      ctx.beginPath(); ctx.moveTo(L, Y(g)); ctx.lineTo(w - Rm, Y(g)); ctx.stroke();
      ctx.fillText((Math.abs(g) < 1e-9 ? 0 : +g.toFixed(2)), L - 6, Y(g) + 4);
    }
    ctx.textAlign = 'center';
    for (var s = XMIN; s <= XMAX; s += 10) ctx.fillText(s, X(s), h - 8);
    ctx.strokeStyle = muted; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(L, Y(0)); ctx.lineTo(w - Rm, Y(0)); ctx.stroke();
    ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(X(S0), Tp); ctx.lineTo(X(S0), h - B); ctx.stroke();
    function curve(arr, color, dash, lw) {
      ctx.strokeStyle = color; ctx.setLineDash(dash); ctx.lineWidth = lw; ctx.beginPath();
      arr.forEach(function (p, i) { if (i === 0) ctx.moveTo(X(xs[i]), Y(p)); else ctx.lineTo(X(xs[i]), Y(p)); });
      ctx.stroke(); ctx.setLineDash([]);
    }
    curve(now, accent, [6, 4], 2);
    curve(ex, line, [], 2.5);

    var be = [];
    for (var i = 1; i < ex.length; i++) {
      if ((ex[i - 1] < 0) !== (ex[i] < 0)) be.push(xs[i - 1] + (xs[i] - xs[i - 1]) * (-ex[i - 1]) / (ex[i] - ex[i - 1]));
    }
    var netUp = 0; legs.forEach(function (l) { if (l[0] !== 'P') netUp += l[2]; });
    var maxLoss = netUp < 0 ? 'unlimited (as the stock rises)' : fmt(-Math.min(value(legs, 0, 0, vol) - cost, Math.min.apply(null, ex)));
    var maxGain = netUp > 0 ? 'unlimited' : fmt(Math.max(value(legs, 0, 0, vol) - cost, Math.max.apply(null, ex)));
    out.textContent = 'Entry cost: ' + (cost >= 0 ? fmt(cost) + ' paid' : fmt(-cost) + ' received') +
      ' per share.  Break-even at expiry: ' + (be.length ? be.map(function (b) { return '$' + b.toFixed(2); }).join(', ') : 'none in range') +
      '.  Max gain: ' + maxGain + '.  Max loss: ' + maxLoss + '.  Profit today at $100: ' + fmt(now[(S0 - XMIN) * 2]) + '.';
  }
  [sel, dIn, vIn].forEach(function (el) { el.addEventListener('input', draw); });
  window.addEventListener('resize', draw);
  document.addEventListener('rr:themechange', draw);
  draw();
})();
</script>

What each strategy is for:

- **Long call / long put.** Directional bets with capped loss; the move must be big enough, soon enough, to beat the premium.
- **Short put.** Collect a premium and agree to buy at $$K$$ if the stock falls below it. Risk is like owning the stock below $$K$$, with upside capped at the premium.
- **Covered call.** Own the stock and sell an OTM call: premium now, in exchange for gains above the strike. Its shape matches a short put, since parity gives $$S - c = Ke^{-rT} - p$$.
- **Protective put.** Own the stock and buy an OTM put: insurance with a floor near $$K$$.
- **Vertical spread.** Buy one option, sell another of the same type at a different strike. The sold leg subsidises the bought one and caps the gain, so both risk and reward are bounded.
- **Straddle.** A call and a put at one strike: a pure bet that the stock moves a lot, in either direction.
- **Iron condor.** Short an OTM put spread and an OTM call spread: you keep the premium if the stock stays in a range, with defined risk.

## How beginners lose money

1. **Treating options as cheap stock.** Most OTM options expire worthless. You need direction, magnitude, *and* timing to be right; being right but slow still loses everything.
2. **Ignoring time decay and IV.** Theta erodes every long option daily and accelerates into expiry, most harshly for short-dated OTM contracts. Buying before earnings means paying for volatility that collapses on the announcement.
3. **Selling naked options for "income".** Short options win small amounts often and lose large amounts occasionally; one gap move can erase years of premium.
4. **Trading illiquid contracts and forgetting expiry mechanics.** Wide spreads are a guaranteed cost, and an ITM option held through expiry is auto-exercised into a stock position you may not be able to afford.

> **A reasonable way to start.** Learn on paper first: most brokers offer simulated trading. Use defined-risk positions (long options, spreads) so the maximum loss is known when you enter. Size each position so that losing the whole premium would be acceptable. Before each trade, write down the break-even, the maximum loss, and what you'll do at expiry.
{: .key}

## Summary

- A **call** is the right to buy, and a **put** the right to sell, a given underlying at a fixed **strike** by a fixed **expiration**. The buyer pays a **premium** and has limited loss. The seller receives it and takes on the obligation. One US equity contract covers 100 shares.
- At expiry a call pays $$(S_T - K)^+$$ and a put pays $$(K - S_T)^+$$. Before expiry, price = intrinsic value + time value, and the time value exists because the payoff is **convex**.
- Prices come from **replication and no arbitrage**, not from forecasts of direction. Equivalently, an option's price is its discounted expected payoff under the **risk-neutral measure**. The binomial tree converges to **Black–Scholes**, and **put–call parity** links calls and puts without any model.
- The one unobservable input is **volatility**. Markets quote options by **implied volatility**, and the **Greeks** (delta, gamma, theta, vega, rho) describe how a position's value changes. Long options are long gamma and pay for it with theta.
- Listed options trade on exchanges, are guaranteed by the **OCC**, and are opened and closed like any other security. Use limit orders, mind the bid–ask spread, understand **exercise and assignment**, and know your maximum loss before you enter.
