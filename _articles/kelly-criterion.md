---
title: "The Kelly Criterion"
subtitle: "How much to bet when you have an edge — and why the answer is a logarithm."
topic: finance
tags: [kelly-criterion, information-theory, portfolio-theory, online-learning, probability]
reading_time: 12
date: 2026-10-09
level: advanced
summary: "Derives the Kelly bet from first principles, interprets the optimal growth rate as an information quantity, shows why over-betting is catastrophic, and connects log-optimal investing to universal portfolios and regret bounds in online learning."
brief: "Explain the Kelly criterion rigorously: the derivation, its information-theoretic meaning, practical caveats (fractional Kelly, estimation error, drawdowns), and its connection to online portfolio selection. Math and code welcome; ~12 minutes."
references:
  - title: "J. L. Kelly Jr. (1956). A New Interpretation of Information Rate. Bell System Technical Journal 35(4), 917–926."
  - title: "L. Breiman (1961). Optimal Gambling Systems for Favorable Games. Proc. Fourth Berkeley Symposium on Mathematical Statistics and Probability, vol. 1."
  - title: "P. A. Samuelson (1979). Why we should not make mean log of wealth big though years to act are long. Journal of Banking & Finance 3(4)."
  - title: "T. M. Cover (1991). Universal Portfolios. Mathematical Finance 1(1), 1–29."
  - title: "T. M. Cover & J. A. Thomas (2006). Elements of Information Theory, 2nd ed., chapters 6 and 16."
  - title: "E. O. Thorp (2006). The Kelly Criterion in Blackjack, Sports Betting and the Stock Market. Handbook of Asset and Liability Management, vol. 1."
  - title: "E. Hazan, A. Agarwal & S. Kale (2007). Logarithmic Regret Algorithms for Online Convex Optimization. Machine Learning 69, 169–192."
---

Suppose someone offers you a coin that lands heads with probability $$p = 0.6$$ and lets you bet on it at even odds, as many times as you like. You have an edge — every dollar wagered returns $$0.2$$ dollars in expectation. The question is not *whether* to bet but *how much*. Bet everything every time and you are bankrupt the first time the coin lands tails, which happens almost surely. Bet a penny and you waste the edge. Somewhere between lies a fraction that makes your wealth grow fastest, and finding it is the content of the Kelly criterion.

## The setup

Each round you stake a fraction $$f \in [0, 1)$$ of current wealth on an outcome that occurs with probability $$p$$. If it occurs you win $$b$$ per unit staked (net odds $$b{:}1$$); otherwise you lose the stake. Write $$q = 1 - p$$. After $$n$$ independent rounds with $$S_n$$ wins,

$$
W_n = W_0\,(1 + bf)^{S_n}\,(1 - f)^{\,n - S_n}.
$$

Wealth is a *product* of random factors, so the natural quantity is its logarithm, which is a *sum*:

$$
\frac{1}{n}\log\frac{W_n}{W_0} = \frac{S_n}{n}\log(1 + bf) + \Big(1 - \frac{S_n}{n}\Big)\log(1 - f)
\;\xrightarrow{\text{a.s.}}\; G(f) := p\log(1 + bf) + q\log(1 - f).
$$

By the strong law of large numbers, $$W_n \approx W_0\, e^{n G(f)}$$ on almost every sample path. $$G(f)$$ is the **exponential growth rate**, and it — not the expected wealth — determines what you actually experience over a long horizon.

> **Why not maximise $$\mathbb{E}[W_n]$$?** Expected wealth is $$W_0(1 + (bp - q)f)^n$$, which is increasing in $$f$$, so it says "bet everything". That expectation is carried by a single path of exponentially small probability on which you never lose. The median investor is ruined. The arithmetic mean of a multiplicative process is a terrible summary of its typical behaviour.
{: .key}

## Deriving the optimal fraction

$$G$$ is strictly concave on $$[0, 1)$$ (a positive combination of concave logs), so the first-order condition identifies the unique maximiser:

$$
G'(f) = \frac{pb}{1 + bf} - \frac{q}{1 - f} = 0
\quad\Longrightarrow\quad
f^\star = \frac{bp - q}{b} = p - \frac{q}{b}.
$$

The numerator $$bp - q$$ is the expected profit per unit staked — the *edge* — and $$b$$ is the payout odds. Hence the mnemonic **edge over odds**. If the edge is non-positive, $$f^\star \le 0$$: don't bet. For the even-money coin ($$b = 1$$) the formula collapses to $$f^\star = p - q = 2p - 1$$, so with $$p = 0.6$$ you stake 20% of wealth each round.

Drag the slider to see how the growth curve and its peak move with the win probability.

<div class="chart">
<script type="application/vnd.vegalite+json">
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "height": 260,
  "params": [
    {"name": "p", "value": 0.6, "bind": {"input": "range", "min": 0.51, "max": 0.8, "step": 0.01, "name": "win probability p  "}}
  ],
  "data": {"sequence": {"start": 0, "stop": 0.99, "step": 0.005, "as": "f"}},
  "transform": [
    {"calculate": "p * log(1 + datum.f) + (1 - p) * log(1 - datum.f)", "as": "G"},
    {"filter": "datum.G > -0.08"}
  ],
  "encoding": {
    "x": {"field": "f", "type": "quantitative", "title": "fraction of wealth staked, f", "scale": {"domain": [0, 1]}},
    "y": {"field": "G", "type": "quantitative", "title": "growth rate G(f), nats per bet"}
  },
  "layer": [
    {"mark": {"type": "rule", "strokeDash": [3, 3], "opacity": 0.6}, "encoding": {"x": null, "y": {"datum": 0}}},
    {"mark": {"type": "line", "strokeWidth": 2.5}},
    {
      "transform": [{"filter": "abs(datum.f - (2 * p - 1)) < 0.0025"}],
      "layer": [
        {"mark": {"type": "point", "size": 70, "filled": true}},
        {"mark": {"type": "text", "dy": -14, "fontSize": 11, "fontWeight": 600}, "encoding": {"text": {"value": "Kelly f* = 2p − 1"}}}
      ]
    },
    {
      "transform": [{"filter": "abs(datum.f - (p - 0.5)) < 0.0025"}],
      "layer": [
        {"mark": {"type": "point", "size": 50, "shape": "diamond", "opacity": 0.7}},
        {"mark": {"type": "text", "dy": 16, "fontSize": 11, "opacity": 0.8}, "encoding": {"text": {"value": "half Kelly"}}}
      ]
    }
  ]
}
</script>
<p class="chart-caption">Growth rate of an even-money bet as a function of the staked fraction. The curve is asymmetric: it falls slowly to the left of the peak and steeply to the right, and it crosses zero at roughly twice the Kelly fraction.</p>
</div>

Plugging $$f^\star$$ back in gives the optimal growth rate. At even odds,

$$
G(f^\star) = p\log(2p) + q\log(2q) = \log 2 - H(p),
$$

where $$H(p) = -p\log p - q\log q$$ is the binary entropy. For $$p = 0.6$$ this is $$\approx 0.0201$$ nats per bet: wealth roughly doubles every $$\log 2 / 0.0201 \approx 34$$ bets.

## The information-theoretic reading

Kelly's 1956 paper was not about casinos; it was titled *A New Interpretation of Information Rate* and was written at Bell Labs. His gambler receives tips over a noisy binary channel that is correct with probability $$p$$. Measured in bits, $$\log_2 2 - H_2(p) = 1 - H_2(p)$$ is exactly the capacity of a binary symmetric channel with crossover probability $$q$$. The maximal rate at which a gambler can compound money equals the rate at which the tip channel can transmit information.

The general version is the horse race of Cover and Thomas. With outcomes $$i \in \{1, \dots, m\}$$ occurring with probability $$p_i$$, odds $$o_i$$-for-1, and a bettor who distributes all wealth according to $$\mathbf{b}$$ on the simplex, the doubling rate is

$$
W(\mathbf{b}, \mathbf{p}) = \sum_{i} p_i \log(b_i o_i) = \sum_i p_i \log o_i - H(\mathbf{p}) - D(\mathbf{p}\,\|\,\mathbf{b}).
$$

The decomposition makes three facts immediate:

1. **Proportional betting is optimal:** $$\mathbf{b}^\star = \mathbf{p}$$, independent of the odds, because only the KL term depends on $$\mathbf{b}$$.
2. **Model error costs exactly a KL divergence.** Betting with beliefs $$\mathbf{b} \neq \mathbf{p}$$ sacrifices $$D(\mathbf{p}\,\|\,\mathbf{b})$$ of growth rate.
3. **Side information is worth its mutual information.** If you observe $$Y$$ correlated with the outcome $$X$$ and bet $$\mathbf{b}(\cdot \mid y) = p(\cdot \mid y)$$, the growth rate rises by precisely $$I(X; Y)$$.

> **Theorem (Breiman, 1961).** Let $$W_n^\star$$ be the wealth of the log-optimal strategy and $$W_n$$ that of any other non-anticipating strategy. Then $$W_n / W_n^\star$$ is a non-negative supermartingale, so $$\mathbb{E}[W_n / W_n^\star] \le 1$$ for all $$n$$; and if the other strategy is asymptotically different, $$W_n^\star / W_n \to \infty$$ almost surely. The log-optimal strategy also asymptotically minimises the expected time to reach a large wealth target.
{: .theorem}

## Simulation: the cost of over-betting

The asymmetry of $$G$$ is the practical heart of Kelly. Expand around zero for a small edge $$\mu = bp - q$$ at even odds: $$G(f) \approx \mu f - \tfrac{1}{2}f^2$$. This parabola peaks at $$f = \mu$$ and returns to zero at $$f = 2\mu$$. **Betting twice Kelly gives you zero growth with far more volatility; betting more than that guarantees eventual ruin**, even though every individual bet has positive expectation. (For $$p = 0.6$$ the exact zero crossing is $$f \approx 0.389$$, slightly below $$2f^\star = 0.4$$.)

A Monte Carlo check with ten thousand paths of a thousand bets each:

```python
import numpy as np

def log_wealth(f, p=0.6, b=1.0, n=1_000, paths=10_000, seed=0):
    """log(W_n / W_0) for `paths` independent runs of n bets."""
    rng = np.random.default_rng(seed)
    wins = rng.random((paths, n)) < p
    return np.where(wins, np.log1p(b * f), np.log1p(-f)).sum(axis=1)

for f in [0.1, 0.2, 0.3, 0.4]:
    lw = log_wealth(f)
    print(f"f={f:.1f}  median growth/bet={np.median(lw)/1_000:+.4f}  "
          f"P(W_n < W_0)={np.mean(lw < 0):.3f}")
```

```text
f=0.1  median growth/bet=+0.0150  P(W_n < W_0)=0.000
f=0.2  median growth/bet=+0.0201  P(W_n < W_0)=0.001
f=0.3  median growth/bet=+0.0147  P(W_n < W_0)=0.067
f=0.4  median growth/bet=-0.0024  P(W_n < W_0)=0.561
```

The empirical medians match $$G(f)$$ to four decimals. Note the symmetry in growth ($$f = 0.1$$ and $$f = 0.3$$ grow at nearly the same rate) and the asymmetry in risk: the bettor at $$f = 0.3$$ is roughly seventy times as likely as the Kelly bettor to end up behind.

## Continuous time and the Sharpe ratio

For a stock following geometric Brownian motion with drift $$\mu$$ and volatility $$\sigma$$, alongside a risk-free rate $$r$$, holding a constant fraction $$f$$ in the stock (continuously rebalanced) gives log-wealth growth

$$
g(f) = r + f(\mu - r) - \tfrac{1}{2}f^2\sigma^2,
\qquad
f^\star = \frac{\mu - r}{\sigma^2},
\qquad
g(f^\star) = r + \frac{1}{2}\Big(\frac{\mu - r}{\sigma}\Big)^2.
$$

The excess growth of the Kelly investor is half the squared Sharpe ratio. Because $$g$$ is exactly quadratic here, running a fraction $$c$$ of Kelly yields a share $$2c - c^2$$ of the optimal excess growth. In this idealised model the probability that wealth *ever* falls to a fraction $$x$$ of its starting value is $$x^{2/c - 1}$$:

| Kelly multiple $$c$$ | Share of max excess growth | P(ever halving) |
|---:|---:|---:|
| 0.25 | 0.44 | 0.008 |
| 0.50 | 0.75 | 0.125 |
| 0.75 | 0.94 | 0.315 |
| 1.00 | 1.00 | 0.500 |
| 1.50 | 0.75 | 0.794 |
| 2.00 | 0.00 | 1.000 |

Full Kelly has a 50% chance of halving your wealth at some point. Half Kelly keeps three-quarters of the growth and cuts that probability to one in eight. This is why practitioners, from Thorp onward, rarely bet full Kelly.

## Caveats worth taking seriously

**Parameters are estimated, not known.** The formula $$f^\star = (\mu - r)/\sigma^2$$ is linear in an expected return that is notoriously hard to estimate. Errors are asymmetric in their consequences: overestimate the edge by a factor of two and you are betting $$2\times$$ Kelly, which from the table above is zero growth; underestimate it by the same factor and you still keep 75% of the optimal growth, with far smaller drawdowns. Shading below the estimated Kelly fraction is therefore the standard robust response to parameter uncertainty.

**Log utility is a choice.** Samuelson objected that maximising $$\mathbb{E}\log W$$ is optimal only for an investor whose utility *is* logarithmic; an investor with more risk aversion should bet less even over long horizons, and asymptotic dominance with probability one does not imply higher expected utility at any fixed horizon. (He made the point in a paper written entirely in words of one syllable.) The defensible claim is narrower: Kelly is the unique strategy that maximises long-run *growth*, and any fraction above it is dominated by a smaller one with the same growth and less risk.

**The horizon must be long.** All of the guarantees are asymptotic. Over twenty bets, the law of large numbers has barely started working.

## Connection to online learning

Drop the probabilistic assumptions entirely. At each round $$t$$ an adversary reveals a vector of price relatives $$\mathbf{x}_t \in \mathbb{R}^m_{+}$$, and you choose a portfolio $$\mathbf{b}_t$$ on the simplex $$\Delta_m$$. Your log-wealth is $$\sum_t \log(\mathbf{b}_t^\top \mathbf{x}_t)$$, and the natural benchmark is the best **constant-rebalanced portfolio** in hindsight — the deterministic analogue of a Kelly bettor who knew the distribution:

$$
\text{Regret}_T = \max_{\mathbf{b} \in \Delta_m} \sum_{t=1}^T \log(\mathbf{b}^\top \mathbf{x}_t) - \sum_{t=1}^T \log(\mathbf{b}_t^\top \mathbf{x}_t).
$$

Cover's **universal portfolio** plays the wealth-weighted average of all constant-rebalanced portfolios,

$$
\mathbf{b}_{t+1} = \frac{\int_{\Delta_m} \mathbf{b}\, W_t(\mathbf{b})\, d\mu(\mathbf{b})}{\int_{\Delta_m} W_t(\mathbf{b})\, d\mu(\mathbf{b})},
$$

and with the uniform prior guarantees a final wealth of at least $$W_T^{\text{best CRP}} / (T+1)^{m-1}$$, i.e. regret at most $$(m - 1)\log(T + 1)$$ against *any* sequence of returns; a Dirichlet$$(\tfrac12, \dots, \tfrac12)$$ prior sharpens this to $$\tfrac{m-1}{2}\log T + O(1)$$. The average per-round regret vanishes, so you compound at the best constant-rebalanced rate without knowing any distribution.

The loss $$\ell_t(\mathbf{b}) = -\log(\mathbf{b}^\top \mathbf{x}_t)$$ is exp-concave, which is why logarithmic regret is achievable at all. Cover's algorithm is computationally heavy (an integral over the simplex), but the **Online Newton Step** of Hazan, Agarwal and Kale attains $$O(m \log T)$$ regret for exp-concave losses at polynomial cost per round, assuming the price relatives are bounded away from zero. Viewed this way, the Kelly criterion is the stochastic special case of a much more general statement: **maximising log-wealth is a well-posed online learning problem with logarithmic regret.**

## Summary

- The Kelly fraction maximises the almost-sure growth rate $$G(f) = \mathbb{E}\log(1 + fR)$$; for a binary bet it is $$f^\star = p - q/b$$, and in continuous time $$(\mu - r)/\sigma^2$$.
- The optimal growth rate is an information quantity: $$\log 2 - H(p)$$ for a fair-odds coin, with model error costing $$D(\mathbf{p}\,\|\,\mathbf{b})$$ and side information adding $$I(X; Y)$$.
- Over-betting is far worse than under-betting; at $$2\times$$ Kelly the growth is zero. Fractional Kelly trades a little growth for much smaller drawdowns.
- Without any stochastic model, universal portfolios and Online Newton Step achieve logarithmic regret against the best constant-rebalanced portfolio.
