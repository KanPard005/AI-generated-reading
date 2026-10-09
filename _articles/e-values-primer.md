---
title: "E-values: A Technical Primer"
subtitle: "Nonnegative statistics with expectation at most one under the null, and what that single inequality buys: anytime validity, free merging, and FDR control under arbitrary dependence."
topic: science
tags: [e-values, hypothesis-testing, sequential-analysis, martingales, multiple-testing, online-learning]
reading_time: 30
date: 2026-10-09
level: advanced
summary: "Defines e-values and their validity via Markov and Ville, shows how to construct them (likelihood ratios, universal inference, mixtures, betting), compares them with p-values, and covers growth-rate optimality, merging, e-BH, and links to online learning."
brief: "A 30-minute technical primer on e-values: definitions, constructions, calibration against p-values, sequential testing and e-processes, testing by betting with an interactive demo, optimality, multiple testing, and connections to online learning. Converted from an earlier standalone page."
references:
  - 'Ramdas & Wang, *Hypothesis Testing with E-values* (monograph, 2024/25). The best single starting point and the source for most statements above.'
  - 'Vovk & Wang, "E-values: calibration, combination and applications", *Annals of Statistics* 2021.'
  - 'Shafer, "Testing by betting: a strategy for statistical and scientific communication", *JRSS-A* 2021.'
  - 'Grünwald, de Heide & Koolen, "Safe testing", *JRSS-B* 2024.'
  - 'Ramdas, Grünwald, Vovk & Shafer, "Game-theoretic statistics and safe anytime-valid inference", *Statistical Science* 2023.'
  - 'Wasserman, Ramdas & Balakrishnan, "Universal inference", *PNAS* 2020.'
  - 'Wang & Ramdas, "False discovery rate control with e-values", *JRSS-B* 2022.'
  - 'Waudby-Smith & Ramdas, "Estimating means of bounded random variables by betting", *JRSS-B* 2024.'
  - 'Howard, Ramdas, McAuliffe & Sekhon, "Time-uniform, nonparametric, nonasymptotic confidence sequences", *Annals of Statistics* 2021.'
  - 'Ramdas, Ruf, Larsson & Koolen, "Admissible anytime-valid sequential inference must rely on nonnegative martingales", 2020.'
  - 'Orabona & Pál, "Coin betting and parameter-free online learning", NeurIPS 2016.'
---

An e-value is a nonnegative statistic whose expectation under the null is at most one. Almost everything else in the area (anytime-valid inference, merging, FDR control under arbitrary dependence, optimal tests) follows from taking that single inequality seriously.

> **Notation.** $$\mathcal{P}$$ is the null hypothesis (a set of distributions), $$\alpha$$ the level, and $$\mathbb{E}_P$$ expectation under $$P$$. Observations are $$X_1, X_2, \dots$$ with filtration $$\mathcal{F}_t=\sigma(X_1,\dots,X_t)$$.
{: .aside}

## 1. Definition and validity

> **Definition (e-variable, e-value).** A random variable $$E \ge 0$$ (values in $$[0,\infty]$$) is an *e-variable* for the null $$\mathcal{P}$$ if 
>
> $$
> \mathbb{E}_P[E] \le 1 \qquad \text{for all } P \in \mathcal{P}.
> $$
>
> Its realized value is an *e-value*. Large $$E$$ is evidence against $$\mathcal{P}$$.
{: .definition}

> **Proposition 1 (validity via Markov).** If $$E$$ is an e-variable, then for every $$P\in\mathcal{P}$$ and $$\alpha\in(0,1)$$, 
>
> $$
> P\big(E \ge 1/\alpha\big) \le \alpha .
> $$
>
> Equivalently $$\min(1, 1/E)$$ is a valid p-variable. So the test "reject when $$E \ge 1/\alpha$$" has type-I error at most $$\alpha$$.
{: .theorem}

The proof is Markov's inequality, and Markov is tight only when $$E \in \{0, 1/\alpha\}$$ a.s., so e-tests are generally conservative in a single-shot setting. What you buy with that conservativeness is robustness, developed in the rest of this primer.

### Three useful readings of $$\mathbb{E}_P[E]\le 1$$

**Likelihood-ratio reading.** If $$\mathcal{P}=\{p_0\}$$ and $$q$$ is any density, then $$E=q(X)/p_0(X)$$ has $$\mathbb{E}_{p_0}[E]=\int q \le 1$$. E-variables generalize likelihood ratios.

**Betting reading.** Pay one unit of money for a ticket that pays $$E$$. If the null is true you cannot expect to profit. The realized $$E$$ is the multiplicative gain, and "evidence" is literally how much money you made betting against the null. This is the Shafer–Vovk game-theoretic view.

**Convexity.** The constraint is linear in $$P$$, so $$E$$ is an e-variable for $$\mathcal{P}$$ iff it is one for $$\mathrm{conv}(\mathcal{P})$$ (closure under mixtures of null distributions). This is why composite nulls are handled by one inequality rather than a worst-case over tail probabilities, and why convex hulls reappear in Section 6.

|  | p-value | e-value |
|---|---|---|
| Validity condition | $$P(p\le \alpha)\le\alpha$$ for all $$\alpha$$ (tail probability) | $$\mathbb{E}_P[E]\le 1$$ (first moment) |
| Direction | small is evidence | large is evidence |
| Optional stopping / continuation | invalid without correction | valid (Section 4) |
| Combining dependent evidence | needs a price (e.g. Bonferroni, harmonic mean corrections) | arithmetic mean is valid under arbitrary dependence |
| Composite null | sup over null of tail probabilities | sup over null of expectations |

## 2. Constructing e-values

> **Example 1 (Bayes factor, simple null).** For $$H_0:X\sim p_0$$ and any prior $$\pi$$ on alternatives, $$\int p_\theta(X)\,d\pi(\theta)\,/\,p_0(X)$$ is an e-variable. With a composite null, the denominator must be handled with care; a Bayes factor with a prior on the null is not automatically an e-variable (it is for suitable invariant, right-Haar-type priors, see Grünwald et al.).
{: .example}

> **Theorem 2 (universal inference, split LRT; Wasserman–Ramdas–Balakrishnan 2020).** Split an i.i.d. sample into $$D_1, D_0$$. Let $$\hat\theta_1$$ be *any* estimator computed from $$D_1$$ (MLE, Bayes, regularized, a neural net). Let $$L_{D_0}(\theta)=\prod_{x\in D_0}p_\theta(x)$$. For $$H_0:\theta\in\Theta_0$$, 
>
> $$
> E \;=\; \frac{L_{D_0}(\hat\theta_1)}{\sup_{\theta\in\Theta_0}L_{D_0}(\theta)}
> $$
>
> is an e-variable, with no regularity conditions on the model.
>
> *Proof.* Fix the true $$\theta^*\in\Theta_0$$. The denominator is at least $$L_{D_0}(\theta^*)$$, so $$E\le L_{D_0}(\hat\theta_1)/L_{D_0}(\theta^*)$$. Conditional on $$D_1$$, $$\hat\theta_1$$ is fixed and the right side has expectation $$\int p_{\hat\theta_1}\le 1$$ under $$\theta^*$$.
{: .theorem}

Theorem 2 is the template for most modern constructions: **use an arbitrary predictor/estimator on data independent of the evaluation data, then evaluate a likelihood ratio (or any nonnegative bet) with it**. Sample splitting costs power; Section 4 shows how to avoid the cost by estimating predictably instead of splitting.

> **Example 3 (Gaussian mixture).** Observe $$X_i\sim N(\mu,1)$$, $$H_0:\mu=0$$, $$S_t=\sum_{i\le t}X_i$$. Mixing the likelihood ratios $$e^{\mu S_t-t\mu^2/2}$$ over $$\mu\sim N(0,\rho)$$ gives 
>
> $$
> M_t=\frac{1}{\sqrt{1+\rho t}}\exp\!\Big(\frac{\rho\,S_t^2}{2(1+\rho t)}\Big),
> $$
>
> a nonnegative martingale under $$H_0$$ with $$M_0=1$$. This is Robbins' mixture method; it yields $$\sqrt{t\log t}$$-type boundaries and underlies many confidence sequences.
{: .example}

## 3. Calibration: moving between p-values and e-values

A *calibrator* maps p-values to e-values. The question is which maps preserve validity for every p-variable, with no assumption on the p-variable's distribution other than $$P(p\le u)\le u$$.

> **Theorem 3 (calibrators; Vovk–Wang 2021).**
>
> (a) A nonincreasing $$f:[0,1]\to[0,\infty]$$ turns every p-variable into an e-variable iff $$\int_0^1 f(u)\,du\le 1$$. Admissible calibrators are (essentially) upper semicontinuous with $$f(0)=\infty$$ and $$\int_0^1 f=1$$. A standard family is $$f_\kappa(p)=\kappa p^{\kappa-1}$$, $$\kappa\in(0,1)$$.
>
> (b) In the other direction, $$p=\min(1,1/e)$$ is valid, and it dominates every other e-to-p calibrator.
{: .theorem}

Consequence: composing $$p \mapsto e \mapsto p$$ gives $$p^{1-\kappa}/\kappa \ge p$$ in the interesting range, so the roundtrip loses. There is no free lunch: e-values are not "better p-values". They are a different currency whose payoff is composability. Calibrating a p-value to an e-value is useful mainly when you need to merge it with other evidence (Section 7).

## 4. Sequential analysis: Ville, test martingales, e-processes

> **Definition (test supermartingale, e-process).** A *test supermartingale* for $$P$$ is a nonnegative $$P$$-supermartingale $$(M_t)_{t\ge0}$$ with $$M_0=1$$; a *test martingale* if it is a martingale. An *e-process* for $$\mathcal{P}$$ is a nonnegative adapted process $$(E_t)$$ with 
>
> $$
> \mathbb{E}_P[E_\tau]\le 1\quad\text{for all stopping times }\tau\text{ (possibly infinite) and all }P\in\mathcal{P}.
> $$
>
> For a simple null this is essentially the same as being dominated by a test supermartingale. For composite nulls it can be strictly more general: $$E_t$$ may be dominated by a different test supermartingale for each $$P\in\mathcal{P}$$, none of which needs to be an e-process itself.
{: .definition}

> **Theorem 4 (Ville's inequality, 1939).** If $$(M_t)$$ is a test supermartingale under $$P$$, then 
>
> $$
> P\big(\exists\, t\ge 0:\; M_t \ge 1/\alpha\big)\;\le\;\alpha.
> $$
>
> *Proof sketch.* Let $$\tau=\inf\{t:M_t\ge1/\alpha\}$$. Optional stopping on the bounded time $$\tau\wedge t$$ gives $$1\ge \mathbb{E}[M_{\tau\wedge t}]\ge \alpha^{-1}P(\tau\le t)$$. Let $$t\to\infty$$.
{: .theorem}

Ville is Markov's inequality for the *running maximum*. It means you can monitor $$M_t$$ continuously, stop whenever you like (including based on the data, your funding, or a reviewer's request), and reject the first time $$M_t\ge1/\alpha$$ without inflating the type-I error. Formally, the sequential test is valid at arbitrary stopping times: $$P(M_\tau \ge 1/\alpha)\le\alpha$$. Classical fixed-sample p-values fail this: the law of the iterated logarithm guarantees that a fixed-level z-test, run repeatedly, eventually rejects a true null with probability one.

### Three consequences

**Optional continuation.** If $$E^{(1)}$$ is an e-value from study 1, and study 2 is designed (even chosen) based on study 1's outcome and yields a conditionally valid $$E^{(2)}$$ (i.e. $$\mathbb{E}[E^{(2)}\mid \text{study 1}]\le1$$), then $$E^{(1)}E^{(2)}$$ is an e-value. Products of sequentially valid e-values are e-values; this is the same fact as "products of conditional likelihood ratios are martingales".

**Confidence sequences.** Let $$E_t(\theta)$$ be an e-process for the point null $$\{\theta\}$$. Then 

$$
C_t=\{\theta:\;E_t(\theta)<1/\alpha\}
$$

satisfies $$P_{\theta^*}(\forall t:\ \theta^*\in C_t)\ge1-\alpha$$: a confidence *sequence*, uniformly valid over time. Testing and estimation are dual exactly as in the fixed-sample case, but with time-uniform guarantees. Howard–Ramdas–McAuliffe–Sekhon and Waudby-Smith–Ramdas develop this at length.

**Power without splitting.** In Theorem 2 we split the data. In the sequential setting we can instead use a *predictable plug-in*: $$\hat\theta_{i-1}$$ computed from $$X_1,\dots,X_{i-1}$$ and 

$$
M_t=\prod_{i\le t}\frac{p_{\hat\theta_{i-1}}(X_i)}{p_0(X_i)}
$$

is a test martingale, because each factor has conditional expectation at most 1 given $$\mathcal{F}_{i-1}$$. Every observation is used both to evaluate and (later) to learn.

> **Theorem 5 (admissibility; Ramdas–Ruf–Larsson–Koolen 2020, informal).** For a simple null, every admissible anytime-valid sequential test is (up to the usual equivalences) determined by a nonnegative martingale, i.e. is a test martingale threshold-crossing rule. In short, any sensible sequential test is secretly an e-process.
{: .theorem}

So "e-process" is not one option among many for anytime-valid inference. It is essentially the whole class.

## 5. Testing by betting

Nonparametric nulls are where the betting view pays off. Let $$X_i\in[0,1]$$ and $$H_0:\mathbb{E}[X_i\mid\mathcal{F}_{i-1}]=m$$. Define the wealth process 

$$
K_t=\prod_{i\le t}\big(1+\lambda_i(X_i-m)\big),\qquad \lambda_i\ \text{$\mathcal{F}_{i-1}$-measurable},\ \ \lambda_i\in\Big[-\tfrac{1}{1-m},\ \tfrac1m\Big].
$$

The range of $$\lambda_i$$ keeps each factor nonnegative. Each factor has conditional mean exactly 1, so $$K_t$$ is a test martingale for *any* predictable choice of the bets $$\lambda_i$$, and Ville applies. Using only $$\lambda_i\ge0$$ gives a test of $$\mathbb{E}X\le m$$ (a supermartingale).

The choice of $$\lambda_i$$ is a learning problem. If we knew the alternative mean $$\mu$$ and variance $$\sigma^2$$, the log-optimal (Kelly) bet maximizes $$\mathbb{E}\log(1+\lambda(X-m))$$, which for small edges is $$\lambda\approx(\mu-m)/(\sigma^2+(\mu-m)^2)$$. Plug in running estimates and clip to the admissible range. The demo below does exactly that.

<div class="chart widget" data-no-annotate="">
<div class="widget-row">
<label for="ev-p">True mean \(p\) of Bernoulli data (null: 0.5): <strong id="ev-pval">0.60</strong></label>
<input type="range" id="ev-p" min="0.3" max="0.8" step="0.01" value="0.6" aria-describedby="ev-out">
<button id="ev-again" type="button" class="btn btn--ghost">New sample</button>
<button id="ev-many" type="button" class="btn btn--ghost">Run 1000 trials</button>
</div>
<canvas id="ev-cv" role="img" aria-label="Log base 10 of the betting wealth process over time, with the rejection threshold"></canvas>
<output id="ev-out" aria-live="polite"></output>
<p class="chart-caption">Betting wealth \(K_t\) (log scale) for \(T = 400\) Bernoulli observations, testing \(H_0: \mathbb{E}X = 0.5\) at \(\alpha = 0.05\). The dashed line is the rejection threshold \(1/\alpha = 20\).</p>
</div>

<script>
(function () {
  var cv = document.getElementById('ev-cv'), ctx = cv.getContext('2d');
  var pIn = document.getElementById('ev-p'), pOut = document.getElementById('ev-pval');
  var out = document.getElementById('ev-out');
  var article = document.querySelector('article.article') || document.documentElement;
  var m = 0.5, alpha = 0.05, T = 400, c = 0.5;
  var thr = Math.log10(1 / alpha);
  var path = [], hit = -1;

  function sim(p, keep) {
    var S = 0, SS = 0, n = 0, lk = 0, h = -1, arr = keep ? [0] : null;
    for (var t = 1; t <= T; t++) {
      var mu = (0.5 + S) / (n + 1), v = (0.25 + SS) / (n + 1), d = mu - m;
      var lam = d / (v + d * d);
      lam = Math.max(-c / (1 - m), Math.min(c / m, lam));
      var x = Math.random() < p ? 1 : 0;
      lk += Math.log(1 + lam * (x - m));
      SS += (x - mu) * (x - mu); S += x; n++;
      if (h < 0 && lk >= Math.log(1 / alpha)) h = t;
      if (keep) arr.push(lk / Math.LN10);
    }
    return { arr: arr, hit: h };
  }

  function css(el, name) { return getComputedStyle(el).getPropertyValue(name).trim(); }

  function draw() {
    var root = document.documentElement;
    var dpr = window.devicePixelRatio || 1;
    var w = cv.clientWidth, h = cv.clientHeight;
    if (!w) return;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    var L = 44, R = 12, Tp = 10, B = 26;
    var ymin = -2, ymax = Math.max(thr + 0.7, Math.max.apply(null, path) + 0.3);
    function X(t) { return L + (w - L - R) * t / T; }
    function Y(v) { return Tp + (h - Tp - B) * (1 - (Math.max(v, ymin) - ymin) / (ymax - ymin)); }
    var muted = css(root, '--muted'), grid = css(root, '--border');
    var line = css(article, '--topic') || css(root, '--accent'), accent = css(root, '--accent');
    ctx.font = '12px ' + css(root, '--font-sans');
    ctx.fillStyle = muted; ctx.strokeStyle = grid; ctx.lineWidth = 1;
    for (var g = Math.ceil(ymin); g <= Math.floor(ymax); g++) {
      ctx.beginPath(); ctx.moveTo(L, Y(g)); ctx.lineTo(w - R, Y(g)); ctx.stroke();
      ctx.textAlign = 'right'; ctx.fillText('10^' + g, L - 6, Y(g) + 4);
    }
    ctx.textAlign = 'center';
    [0, 100, 200, 300, 400].forEach(function (t) { ctx.fillText(t, X(t), h - 8); });
    ctx.strokeStyle = muted; ctx.setLineDash([6, 4]); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(L, Y(thr)); ctx.lineTo(w - R, Y(thr)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = muted; ctx.textAlign = 'left';
    ctx.fillText('1/α = 20', L + 6, Y(thr) - 6);
    ctx.strokeStyle = line; ctx.lineWidth = 2; ctx.beginPath();
    for (var t = 0; t <= T; t++) { var xx = X(t), yy = Y(path[t]); if (t === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy); }
    ctx.stroke();
    if (hit > 0) { ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(X(hit), Y(thr), 5, 0, 2 * Math.PI); ctx.fill(); }
  }

  function status(extra) {
    var base = hit > 0 ? 'Wealth first reached 1/α at t = ' + hit + ' (rejected; final wealth 10^' + path[T].toFixed(2) + ').'
                       : 'No rejection within T = ' + T + ' (final wealth 10^' + path[T].toFixed(2) + ').';
    out.textContent = base + (extra ? ' ' + extra : '');
  }

  function resample() {
    var p = parseFloat(pIn.value); pOut.textContent = p.toFixed(2);
    var r = sim(p, true); path = r.arr; hit = r.hit; draw(); status('');
  }

  pIn.addEventListener('input', resample);
  document.getElementById('ev-again').addEventListener('click', resample);
  document.getElementById('ev-many').addEventListener('click', function () {
    var p = parseFloat(pIn.value), cnt = 0, N = 1000;
    for (var i = 0; i < N; i++) if (sim(p, false).hit > 0) cnt++;
    status('Over ' + N + ' trials at p = ' + p.toFixed(2) + ', ' + (100 * cnt / N).toFixed(1) + '% ever crossed 1/α' +
           (Math.abs(p - m) < 1e-9 ? ' (type-I error; must be ≤ 5%).' : ' (power within T rounds).'));
  });
  window.addEventListener('resize', draw);
  document.addEventListener('rr:themechange', draw);
  resample();
})();
</script>

Things to check in the demo: (i) at $$p=0.5$$ the fraction of 1000 runs that *ever* cross $$1/\alpha=20$$ within $$T=400$$ rounds stays below 5% despite continuous monitoring, which is Ville in action. (ii) As $$p$$ moves away from 0.5 the wealth grows roughly linearly on the log scale, at a rate close to the KL divergence between the alternative and the null (Section 6).

```python
import numpy as np

def bet_eprocess(x, m, alpha=0.05, c=0.5):
    """Predictable-plug-in betting e-process for H0: E[X]=m, X in [0,1]."""
    logK, S, SS, out = 0.0, 0.0, 0.0, []
    for n, xi in enumerate(x):
        mu = (0.5 + S) / (n + 1)                 # running mean (prior pseudo-obs)
        var = (0.25 + SS) / (n + 1)              # running variance
        d = mu - m
        lam = d / (var + d * d)                  # approx. Kelly bet
        lam = np.clip(lam, -c / (1 - m), c / m)  # keep 1 + lam*(x-m) >= 1 - c
        logK += np.log1p(lam * (xi - m))
        SS += (xi - mu) ** 2; S += xi
        out.append(logK)
    out = np.array(out)
    rej = np.argmax(out >= np.log(1 / alpha)) if (out >= np.log(1 / alpha)).any() else None
    return out, rej
```

## 6. Optimality: GRO and e-power

Among all e-variables, which is best? There is no single power function, but there is a canonical criterion that matches the betting picture: maximize the *expected log-growth* under a specified alternative $$Q$$.

> **Definition (GRO, e-power).** The e-power of an e-variable $$E$$ against $$Q$$ is $$\mathbb{E}_Q[\log E]$$. $$E^*$$ is *growth-rate optimal* (GRO) if it maximizes this over all e-variables for $$\mathcal{P}$$.
{: .definition}

> **Theorem 6 (GRO via reverse information projection; Grünwald–de Heide–Koolen 2024, building on Li 1999).**
>
> (a) For simple null $$P_0$$ and alternative $$Q$$ (with $$Q\ll P_0$$), the GRO e-variable is the likelihood ratio $$q/p_0$$, with e-power $$\mathrm{KL}(Q\,\|\,P_0)$$.
>
> (b) For composite null, under suitable regularity conditions, let $$P^*$$ be the *reverse information projection* of $$Q$$ onto $$\mathrm{conv}(\mathcal{P})$$, i.e. the minimizer of $$\mathrm{KL}(Q\|P)$$ over the convex hull. Then $$E^*=q/p^*$$ is GRO and 
>
> $$
> \max_{E}\ \mathbb{E}_Q[\log E]\;=\;\min_{P\in\mathrm{conv}(\mathcal{P})}\mathrm{KL}(Q\,\|\,P).
> $$
{: .theorem}

Two takeaways. First, since e-variables for $$\mathcal{P}$$ and $$\mathrm{conv}(\mathcal{P})$$ coincide, the "distance from the alternative to the null" that governs power is measured to the *convex hull* of the null. A nonconvex null can be much easier to test than its hull suggests only if the alternative is far from the hull. Second, the number of samples needed behaves like $$\log(1/\alpha)/\mathrm{KL}$$: by Wald's identity, the expected rejection time of the likelihood-ratio martingale is about $$\log(1/\alpha)/\mathrm{KL}(Q\|P_0)$$, matching Wald's SPRT-type optimality and the Chernoff–Stein exponent.

## 7. Combining e-values and multiple testing

> **Proposition 7 (merging).** Let $$E_1,\dots,E_K$$ be e-variables for the same null, with arbitrary dependence.
>
> (a) $$\bar E=\frac1K\sum_k E_k$$ is an e-variable (linearity of expectation). Vovk–Wang (2021) show that, among symmetric merging functions valid under arbitrary dependence, the arithmetic mean is essentially the dominant one.
>
> (b) If the $$E_k$$ are independent, or more generally sequentially conditionally valid, $$\prod_kE_k$$ is an e-variable. Under independence there are merging functions that dominate the product.
{: .theorem}

Compare p-values: under arbitrary dependence, merging requires a multiplicity price such as a $$\log K$$ factor (harmonic-mean and Cauchy-style corrections need additional assumptions). With e-values the arithmetic mean pays no such price. This is the key practical reason e-values are attractive for meta-analysis and for combining tests built from the same data.

### FDR control with e-values

Let $$e_1,\dots,e_m$$ be e-values for null hypotheses $$H_1,\dots,H_m$$ (so $$\mathbb{E}[e_i]\le1$$ for each true null $$i\in\mathcal{H}_0$$), with arbitrary dependence across $$i$$.

> **Theorem 8 (e-BH; Wang–Ramdas 2022).** Sort $$e_{[1]}\ge\dots\ge e_{[m]}$$ and set 
>
> $$
> k^*=\max\Big\{k:\ e_{[k]}\ \ge\ \frac{m}{\alpha k}\Big\},
> $$
>
> rejecting the $$k^*$$ hypotheses with the largest e-values (none if the set is empty). Then 
>
> $$
> \mathrm{FDR}\;\le\;\alpha\,\frac{m_0}{m}\;\le\;\alpha,\qquad m_0=|\mathcal{H}_0|,
> $$
>
> under arbitrary dependence among the $$e_i$$.
>
> *Proof sketch.* Rejected nulls satisfy $$e_i\ge m/(\alpha k^*)$$, so $$\mathbf{1}\{i\text{ rejected}\}\le \alpha k^* e_i/m$$. Hence 
>
> $$
> \mathrm{FDR}=\mathbb{E}\Big[\sum_{i\in\mathcal{H}_0}\frac{\mathbf{1}\{i\text{ rejected}\}}{k^*}\Big]\le\sum_{i\in\mathcal{H}_0}\frac{\alpha}{m}\,\mathbb{E}[e_i]\le\frac{\alpha m_0}{m}.
> $$
{: .theorem}

The proof is three lines and needs no dependence assumption. Compare the Benjamini–Hochberg procedure, which requires PRDS (or a $$\log m$$ penalty, i.e. Benjamini–Yekutieli). In fact e-BH is exactly BH applied to $$p_i=1/e_i$$; what changes is the justification, since the e-value property alone delivers FDR control without any dependence assumption. Further results in the same spirit: e-closure principle (Vovk–Wang), FCR control for selective confidence intervals, conformal selection via e-values, and "e-Bonferroni/e-Holm" for FWER.

## 8. Links to online learning and sequential decision-making

**Regret = log-wealth.** Take the bet $$\lambda_i$$ as an action and the loss $$-\log(1+\lambda_i(X_i-m))$$. A betting strategy's log-wealth minus that of the best constant bet in hindsight is a regret. Regret bounds (via Cover's universal portfolio, coin-betting algorithms of Orabona–Pál, online Newton step) translate directly into lower bounds on the e-process growth rate. Conversely, mixtures over $$\lambda$$ (the Robbins method of Example 3) correspond to Bayesian/Cover-style algorithms, and the resulting boundaries are the same shape as those in the parameter-free online learning literature.

**Bandits and adaptive experiments.** Confidence sequences from e-processes give time-uniform guarantees for best-arm identification, off-policy evaluation under adaptive logging, and adaptively collected A/B tests, without requiring a fixed sample size or a union bound over time.

**Where it is still open.** (i) Optimal e-variables for nonconvex or nonparametric nulls and computational cost of RIPr; (ii) power-optimal e-processes for composite alternatives (not just a single $$Q$$); (iii) tighter FDR procedures that exploit partial dependence without losing e-BH's robustness; (iv) sharp finite-time characterizations of the price of anytime validity, and e-values in settings with distribution shift or interference.

> Theorem statements are simplified; check the regularity conditions (for example in Theorems 5 and 6) in the sources. The references were compiled without a database lookup, so verify titles, venues and years before citing them.
{: .aside}
