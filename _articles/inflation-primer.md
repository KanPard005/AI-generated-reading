---
title: "Inflation, from Scratch"
subtitle: "What it is, how it is measured, what it does to an economy, and how central banks and governments try to control it."
topic: finance
tags: [inflation, macroeconomics, monetary-policy, central-banking, interest-rates]
reading_time: 30
date: 2026-10-15
level: intro
summary: "A beginner's guide to inflation for readers comfortable with math but new to economics. Covers what inflation is and how price indices like the CPI measure it; the main causes (demand, supply, money, and expectations); who gains and loses and why most central banks aim for about 2% rather than zero; and how policy fights it, from interest rates and the Taylor rule to fiscal policy and price controls. Ends with four historical episodes and a guide to reading inflation news."
brief: "Create a 30-minute guide to inflation for someone with little economics background: what inflation is, how it affects the economy, and how governments deal with it."
references:
  - title: "N. G. Mankiw. Macroeconomics, 11th ed. Worth (2022)."
    note: "A standard intermediate textbook. The chapters on money and inflation, aggregate supply, and the Phillips curve cover this article in more depth."
  - title: "U.S. Bureau of Labor Statistics. Handbook of Methods: Consumer Price Index."
    url: https://www.bls.gov/opub/hom/cpi/
    note: "How the CPI is actually built: sampling, weights, quality adjustment, and formulas."
  - title: "FRED, Federal Reserve Bank of St. Louis. Consumer Price Index for All Urban Consumers (CPIAUCSL)."
    url: https://fred.stlouisfed.org/series/CPIAUCSL
    note: "Free data and charts. The easiest place to look up current inflation numbers."
  - title: "A. W. Phillips (1958). The Relation between Unemployment and the Rate of Change of Money Wage Rates in the United Kingdom, 1861–1957. Economica 25(100), 283–299."
  - title: "M. Friedman (1968). The Role of Monetary Policy. American Economic Review 58(1), 1–17."
    note: "The presidential address that introduced the natural rate of unemployment and predicted the breakdown of the simple Phillips curve."
  - title: "J. B. Taylor (1993). Discretion versus Policy Rules in Practice. Carnegie-Rochester Conference Series on Public Policy 39, 195–214."
    note: "The original Taylor rule."
  - title: "P. Cagan (1956). The Monetary Dynamics of Hyperinflation. In M. Friedman (ed.), Studies in the Quantity Theory of Money. University of Chicago Press."
    note: "Source of the 50%-per-month definition of hyperinflation."
  - title: "T. J. Sargent (1982). The Ends of Four Big Inflations. In R. E. Hall (ed.), Inflation: Causes and Effects. University of Chicago Press."
    note: "How the 1920s hyperinflations in Austria, Hungary, Poland, and Germany were stopped, and why credibility mattered."
  - title: "M. J. Boskin et al. (1996). Toward a More Accurate Measure of the Cost of Living. Final Report to the U.S. Senate Finance Committee."
    note: "The Boskin Commission's estimate that the CPI overstated inflation by about 1.1 percentage points a year."
  - title: "B. S. Bernanke & O. Blanchard (2023). What Caused the U.S. Pandemic-Era Inflation? NBER Working Paper 31417."
    note: "A careful decomposition of the 2021–23 surge into supply shocks, energy and food prices, and labour-market tightness."
  - title: "M. Goodfriend (2007). How the World Achieved Consensus on Monetary Policy. Journal of Economic Perspectives 21(4), 47–68."
    note: "A readable history of how inflation targeting and central-bank independence became standard."
---

In 1970 an average basket of things an American household buys cost about \$38.80 for every \$313.69 it cost in 2024. Put differently, a dollar in 1970 bought what about \$8.08 buys today. Nothing about the goods made them eight times more valuable. A loaf of bread is still a loaf of bread. What changed is the dollar: each one buys less than it used to.

That steady loss of purchasing power is **inflation**. It is one of the few economic statistics that almost everyone feels directly, in groceries, rent, and wages, and it is the main thing central banks are in charge of controlling. This guide assumes no economics background. It builds up from the definition to measurement, causes, consequences, and policy, and ends with history and a short guide to reading the news. Code that appears was run, and the output shown is real.

> All US figures here are annual averages of the BLS Consumer Price Index unless stated otherwise. Inflation data are revised and updated monthly. For current numbers, see FRED or the BLS (links in the references).
{: .note}

## What inflation is

> **Inflation** is a sustained rise in the *general level* of prices in an economy. Equivalently, it is a sustained fall in the purchasing power of money. The **inflation rate** over a period is the percentage change in a price index:
>
> $$
> \pi_t = \frac{P_t}{P_{t-1}} - 1,
> $$
>
> where $$P_t$$ is the price level (an index such as the CPI) at time $$t$$.
{: .definition}

Two words in the definition do a lot of work.

**General.** If avocados get more expensive because of a bad harvest while laptops get cheaper, that is a change in *relative* prices: the market telling people that avocados are now scarcer relative to laptops. Inflation is when prices across the board drift up together. In practice both happen at once, and separating them is part of what makes inflation hard to read.

**Sustained.** A one-time jump in the price level (say, a sales tax increase) raises measured inflation for one year and then stops. Economists care most about inflation that persists, because persistent inflation gets built into wages, contracts, and expectations.

Some related vocabulary:

- **Deflation**: a sustained *fall* in the general price level, so $$\pi_t < 0$$.
- **Disinflation**: inflation is still positive but getting smaller (for example, from 8% to 3%). Prices are still rising, just more slowly. This is the word for what happened in the US in 2023, and it is often confused with deflation.
- **Hyperinflation**: extremely rapid inflation. A common threshold, due to Phillip Cagan (1956), is 50% *per month*, which compounds to about 13,000% per year.
- **Stagflation**: high inflation together with stagnant output and high unemployment, as in the 1970s.

### Compounding

Inflation compounds like interest. If prices rise at rate $$\pi$$ every year, then after $$n$$ years the price level is $$P_n = P_0(1+\pi)^n$$, and a fixed sum of money buys a fraction

$$
\frac{1}{(1+\pi)^n}
$$

of what it bought at the start. The time for prices to double is $$\ln 2 / \ln(1+\pi) \approx 0.7/\pi$$, the "rule of 70". At 2% a year, prices double in about 35 years. At 5% they double in about 14 years, and at 10% in about 7.

The chart below shows what \$100 of today's money will buy in the future at a constant inflation rate. Move the slider.

<div class="chart">
<script type="application/vnd.vegalite+json">
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "height": 240,
  "params": [{"name": "rate", "value": 3, "bind": {"input": "range", "min": 0, "max": 12, "step": 0.5, "name": "Annual inflation (%) "}}],
  "data": {"sequence": {"start": 0, "stop": 41, "step": 1, "as": "year"}},
  "transform": [{"calculate": "100 / pow(1 + rate / 100, datum.year)", "as": "value"}],
  "layer": [
    {
      "mark": {"type": "line", "strokeWidth": 2.5},
      "encoding": {
        "x": {"field": "year", "type": "quantitative", "title": "Years from now"},
        "y": {"field": "value", "type": "quantitative", "title": "Purchasing power of $100", "scale": {"domain": [0, 100]}},
        "tooltip": [{"field": "year", "type": "quantitative", "title": "Year"}, {"field": "value", "type": "quantitative", "title": "Buys", "format": "$.2f"}]
      }
    },
    {
      "data": {"values": [{"y": 50}]},
      "mark": {"type": "rule", "strokeDash": [4, 4], "opacity": 0.6},
      "encoding": {"y": {"field": "y", "type": "quantitative"}}
    }
  ]
}
</script>
<p class="chart-caption">Where the curve crosses the dashed line is the halving time of money's purchasing power. At 2% it takes 35 years; at 7% about 10.</p>
</div>

## How inflation is measured

There is no single "price of everything", so inflation is measured with a **price index**: the cost of a fixed, representative basket of goods and services, expressed relative to a base period.

### The basket idea

The **Consumer Price Index (CPI)**, published monthly in the US by the Bureau of Labor Statistics (BLS), asks: what would it cost today to buy the same basket that a typical urban household bought in a reference period? Formally, with base-period quantities $$q_{0,j}$$ for goods $$j$$ and prices $$p_{t,j}$$, the classic index (a **Laspeyres index**) is

$$
P_t = 100 \times \frac{\sum_j p_{t,j}\, q_{0,j}}{\sum_j p_{0,j}\, q_{0,j}} .
$$

Dividing numerator and denominator by the base-period spending shows that the index's growth is a weighted average of individual price changes, with weights $$w_j = p_{0,j}q_{0,j} / \sum_k p_{0,k}q_{0,k}$$ equal to each item's share of spending:

$$
\frac{P_t}{P_0} - 1 = \sum_j w_j \left( \frac{p_{t,j}}{p_{0,j}} - 1 \right).
$$

Here is a three-good version.

```python
# A three-good economy: quantities bought in the base year, and prices in two years.
basket = {"rent (months)": 12, "groceries (weeks)": 52, "gasoline (gallons)": 500}
p0 = {"rent (months)": 1500.0, "groceries (weeks)": 120.0, "gasoline (gallons)": 3.00}
p1 = {"rent (months)": 1590.0, "groceries (weeks)": 126.0, "gasoline (gallons)": 3.60}

cost0 = sum(basket[g] * p0[g] for g in basket)
cost1 = sum(basket[g] * p1[g] for g in basket)
print(f"basket cost, year 0: ${cost0:,.0f}")
print(f"basket cost, year 1: ${cost1:,.0f}")
print(f"index (year 0 = 100): {100 * cost1 / cost0:.1f}")
print(f"inflation: {100 * (cost1 / cost0 - 1):.2f}%")
for g in basket:
    share = basket[g] * p0[g] / cost0
    print(f"  {g:20s} weight {share:5.1%}  price change {p1[g]/p0[g]-1:+6.1%}  contribution {share*(p1[g]/p0[g]-1):+.2%}")
```

```text
basket cost, year 0: $25,740
basket cost, year 1: $27,432
index (year 0 = 100): 106.6
inflation: 6.57%
  rent (months)        weight 69.9%  price change  +6.0%  contribution +4.20%
  groceries (weeks)    weight 24.2%  price change  +5.0%  contribution +1.21%
  gasoline (gallons)   weight  5.8%  price change +20.0%  contribution +1.17%
```

Gasoline rose by 20%, by far the largest increase, but it contributed less to inflation than rent did, because rent is a much larger share of spending. This is why a spike in petrol prices feels dramatic but moves the overall index only modestly, and why housing costs matter so much in the real CPI, where **shelter** makes up roughly a third of the basket.

The real CPI follows the same logic at scale. BLS staff collect prices for tens of thousands of items each month across many US cities. Spending weights come from a separate household survey and are now updated every year. The basket is grouped into about two hundred categories, from rent and car insurance to haircuts and breakfast cereal.

### Headline, core, and PCE

You will see several inflation numbers in the news.

- **Headline CPI** is the index for everything in the basket.
- **Core CPI** excludes food and energy. These are not unimportant (they matter a great deal to households), but their prices swing with weather, wars, and oil markets and then often reverse. Core inflation is a better guide to the *underlying trend*, which is what policymakers can influence.
- **PCE inflation** comes from a different index, the Personal Consumption Expenditures price index, produced by the Bureau of Economic Analysis. It covers a broader set of spending (including things paid for on households' behalf, like employer-provided health insurance), uses different weights, and uses a formula that updates the basket as people substitute between goods. PCE inflation has historically run a few tenths of a percentage point below CPI inflation. **The Federal Reserve's 2% target is defined in terms of PCE**, not CPI.

### Why measurement is hard

Any fixed-basket index has known biases, mostly in the direction of *overstating* the true rise in the cost of living.

- **Substitution bias.** When beef gets expensive, people buy more chicken. A fixed basket assumes they keep buying beef, so it overstates how much worse off they are.
- **Quality change.** A \$1,000 phone today is not the same product as a \$1,000 phone five years ago. If part of a price increase reflects a better product, it is not really inflation. Statisticians apply **quality adjustments** (sometimes using regression models of price on product features, called *hedonic* methods), but these are imperfect.
- **New goods.** Products that didn't exist (smartphones, streaming services) enter the basket only with a lag, missing the large early price declines.
- **Outlet substitution.** Shoppers move to cheaper stores and online retailers.

In 1996 the Boskin Commission estimated that these biases made the US CPI overstate inflation by about 1.1 percentage points a year. The BLS has since changed its methods, and the remaining bias is thought to be smaller, but it is not zero. This is one reason central banks target slightly positive inflation rather than zero (more below).

Finally, the CPI describes an average household. Your personal inflation rate depends on what you buy. A renter in a city with soaring rents, or a retiree with high medical spending, can face much higher inflation than the average. A student who doesn't drive is barely affected by petrol prices.

### US inflation since 1960

<div class="chart">
<script type="application/vnd.vegalite+json">
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "height": 260,
  "data": {"values": [{"year":1960,"pi":1.7},{"year":1961,"pi":1.0},{"year":1962,"pi":1.0},{"year":1963,"pi":1.3},{"year":1964,"pi":1.3},{"year":1965,"pi":1.6},{"year":1966,"pi":2.9},{"year":1967,"pi":3.1},{"year":1968,"pi":4.2},{"year":1969,"pi":5.5},{"year":1970,"pi":5.7},{"year":1971,"pi":4.4},{"year":1972,"pi":3.2},{"year":1973,"pi":6.2},{"year":1974,"pi":11.0},{"year":1975,"pi":9.1},{"year":1976,"pi":5.8},{"year":1977,"pi":6.5},{"year":1978,"pi":7.6},{"year":1979,"pi":11.3},{"year":1980,"pi":13.5},{"year":1981,"pi":10.3},{"year":1982,"pi":6.2},{"year":1983,"pi":3.2},{"year":1984,"pi":4.3},{"year":1985,"pi":3.6},{"year":1986,"pi":1.9},{"year":1987,"pi":3.6},{"year":1988,"pi":4.1},{"year":1989,"pi":4.8},{"year":1990,"pi":5.4},{"year":1991,"pi":4.2},{"year":1992,"pi":3.0},{"year":1993,"pi":3.0},{"year":1994,"pi":2.6},{"year":1995,"pi":2.8},{"year":1996,"pi":3.0},{"year":1997,"pi":2.3},{"year":1998,"pi":1.6},{"year":1999,"pi":2.2},{"year":2000,"pi":3.4},{"year":2001,"pi":2.8},{"year":2002,"pi":1.6},{"year":2003,"pi":2.3},{"year":2004,"pi":2.7},{"year":2005,"pi":3.4},{"year":2006,"pi":3.2},{"year":2007,"pi":2.8},{"year":2008,"pi":3.8},{"year":2009,"pi":-0.4},{"year":2010,"pi":1.6},{"year":2011,"pi":3.2},{"year":2012,"pi":2.1},{"year":2013,"pi":1.5},{"year":2014,"pi":1.6},{"year":2015,"pi":0.1},{"year":2016,"pi":1.3},{"year":2017,"pi":2.1},{"year":2018,"pi":2.4},{"year":2019,"pi":1.8},{"year":2020,"pi":1.2},{"year":2021,"pi":4.7},{"year":2022,"pi":8.0},{"year":2023,"pi":4.1},{"year":2024,"pi":2.9}]},
  "layer": [
    {
      "mark": {"type": "bar"},
      "encoding": {
        "x": {"field": "year", "type": "ordinal", "title": null, "axis": {"values": [1960, 1970, 1980, 1990, 2000, 2010, 2020], "labelAngle": 0}},
        "y": {"field": "pi", "type": "quantitative", "title": "CPI inflation (%)"},
        "tooltip": [{"field": "year", "type": "ordinal", "title": "Year"}, {"field": "pi", "type": "quantitative", "title": "Inflation (%)"}]
      }
    },
    {
      "data": {"values": [{"y": 2}]},
      "mark": {"type": "rule", "strokeDash": [4, 4], "opacity": 0.7},
      "encoding": {"y": {"field": "y", "type": "quantitative"}}
    }
  ]
}
</script>
<p class="chart-caption">Annual-average US CPI inflation, 1960–2024 (BLS). The dashed line marks 2%. Note the "Great Inflation" of the 1970s, its end in the early 1980s, three decades of low and stable inflation, and the surge of 2021–23.</p>
</div>

## Why prices rise

There is no single cause of inflation, but economists organise the causes into a few families. A useful mental model is that inflation appears when, across the whole economy, the total amount people want to spend runs ahead of what the economy can produce at current prices, or when the cost of producing things rises.

### Demand-pull inflation

If households, firms, and the government together try to buy more than the economy can produce, sellers can raise prices and still sell everything. This is **demand-pull inflation**: "too much money chasing too few goods". Demand can surge because of tax cuts or government spending, cheap borrowing, rising asset prices that make people feel richer, or a wave of pent-up spending after a crisis.

A key concept here is **potential output**: the amount the economy can produce when labour and capital are fully but sustainably employed. The difference between actual and potential output, as a percentage, is the **output gap**. A positive gap (an economy "running hot", with unemployment unusually low) tends to push inflation up. A negative gap (a recession, with idle workers and factories) tends to push it down.

### Cost-push inflation

Inflation can also start on the supply side. If the cost of an input that nearly everything depends on, such as oil, rises sharply, firms pass the cost on and the general price level rises even without any surge in demand. This is **cost-push** or **supply-shock** inflation. The oil embargo of 1973 and the Iranian revolution of 1979 are classic examples. So are the supply-chain disruptions of 2021 and the energy and food price spike after Russia invaded Ukraine in 2022.

Supply shocks are especially painful because they raise prices *and* reduce output at the same time, which is how stagflation happens. They also put policymakers in a bind, as we will see.

### Money

The oldest theory of inflation links it to the quantity of money. Start from an identity, the **equation of exchange**:

$$
M V = P Y,
$$

where $$M$$ is the stock of money, $$V$$ its **velocity** (how many times a year an average dollar is spent), $$P$$ the price level, and $$Y$$ real output. The right side is total nominal spending. This holds by definition, since $$V$$ is defined as $$PY/M$$. Taking logs and differencing turns products into sums of growth rates:

$$
\underbrace{\mu}_{\text{money growth}} + \underbrace{\nu}_{\text{velocity growth}} \approx \underbrace{\pi}_{\text{inflation}} + \underbrace{g}_{\text{real growth}} .
$$

The **quantity theory of money** adds the assumptions that velocity is roughly stable ($$\nu \approx 0$$) and that real growth is set by productivity and population, not by money. Then $$\pi \approx \mu - g$$: inflation is money growing faster than the economy.

Over long periods and across countries, the evidence for this is strong. Countries with persistently high money growth have persistently high inflation, and every hyperinflation in history has been accompanied by explosive money creation, usually to pay government bills. This is what Milton Friedman meant by "inflation is always and everywhere a monetary phenomenon."

In the short run the link is loose, because velocity is not stable. After the 2008 financial crisis, the Federal Reserve greatly expanded the monetary base, yet inflation stayed *below* 2% for most of the following decade. Banks held the new reserves rather than lending them out, and velocity fell. Modern central banks therefore don't target money growth. They set interest rates instead, which is the subject of a later section.

### Expectations

The fourth ingredient is psychological, and it is what makes inflation persistent. If workers expect prices to rise 5% next year, they will ask for raises of at least 5%. If firms expect their costs and competitors' prices to rise 5%, they will raise their own prices by 5%. Expected inflation becomes actual inflation. This feedback can produce a **wage-price spiral**, in which higher prices lead to higher wage demands, which raise costs and lead to higher prices again.

The flip side is that if everyone *believes* inflation will stay near 2%, a temporary shock (a bad harvest, an oil spike) tends to fade instead of spreading. Economists call this **well-anchored** expectations, and keeping expectations anchored is arguably the most important thing a central bank does.

<div class="flow">
<div class="flow-box flow-box--ghost"><b>Shock</b>Demand surges (stimulus, cheap credit) or costs jump (oil, supply chains).</div>
<div class="flow-arrow">raises</div>
<div class="flow-box"><b>Prices today</b>Firms pass on costs or take advantage of strong demand.</div>
<div class="flow-arrow">may shift</div>
<div class="flow-box"><b>Expectations</b>Workers and firms start assuming higher inflation will continue.</div>
<div class="flow-arrow">feed into</div>
<div class="flow-box flow-box--accent"><b>Persistent inflation</b>Wage settlements, price-setting, and contracts build in the higher rate.</div>
<p class="chart-caption">Shocks start inflation; expectations decide whether it lasts.</p>
</div>

## What inflation does to an economy

### Real versus nominal

Everything with a dollar sign has a **nominal** value (in dollars) and a **real** value (in purchasing power). A salary that rises from \$60,000 to \$63,000 is a 5% nominal raise, but if prices rose 4% over the same year, the real raise is only about 1%. In general,

$$
\text{real growth} \approx \text{nominal growth} - \pi .
$$

The same applies to interest rates. The **Fisher equation** links the nominal interest rate $$i$$ you see quoted, the real interest rate $$r$$, and expected inflation $$\pi^e$$:

$$
(1+i) = (1+r)(1+\pi^e) \quad\Longrightarrow\quad i \approx r + \pi^e .
$$

If a savings account pays 4% and inflation is 3%, your money's purchasing power grows by about 1% a year. If the account pays 1% while inflation runs at 6%, as many did in 2022, your savings lose about 5% of their purchasing power each year even as the balance grows. The real interest rate is what matters for decisions about saving, borrowing, and investing.

### Who wins and who loses

The most important distinction is between inflation that people **anticipated** and inflation that **surprised** them. Anticipated inflation gets built into contracts: lenders charge higher nominal rates, unions negotiate higher raises. Unanticipated inflation redistributes wealth.

> **Example.** You borrow \$10,000 for one year at 5%, and both you and the bank expect 2% inflation, so the expected real rate is about 3%. Inflation actually comes in at 8%. You repay \$10,500, but those dollars buy only about \$10,500 / 1.08 ≈ \$9,722 worth of goods at the original prices. The bank expected a real return of about 3% and instead lost almost 3%. You, the borrower, gained the difference.
{: .example}

In general, surprise inflation:

- **Helps borrowers and hurts lenders.** That includes homeowners with fixed-rate mortgages (helped) and holders of conventional bonds (hurt). The biggest borrower in most countries is the government, so surprise inflation also shrinks the real value of public debt.
- **Hurts people on fixed nominal incomes**, such as some pensions, and those holding cash.
- **Hurts workers whose wages lag behind prices.** Wages typically adjust more slowly than prices, so in the early phase of an inflation surge, real wages usually fall. This is a large part of why inflation is so unpopular.

Some incomes are protected by **indexation**, which links payments automatically to a price index. In the US, Social Security benefits get an annual cost-of-living adjustment based on a version of the CPI, federal income-tax brackets are indexed, and the Treasury sells **TIPS** (Treasury Inflation-Protected Securities) and **I bonds** whose payouts rise with the CPI.

### The costs of steady inflation

Even fully anticipated inflation is not free, although moderate rates impose only modest costs.

- **Uncertainty.** Higher inflation tends to be more variable. Uncertainty about future prices makes long-term contracts, investment decisions, and saving harder to plan.
- **Noisy price signals.** Prices carry information. When everything is rising quickly, it is hard to tell whether a price increase reflects a real change in scarcity or just general inflation, so resources get misallocated.
- **Tax distortions.** Many taxes apply to nominal amounts. A capital gain that only kept pace with inflation is still taxed in the US as a gain. Where brackets are not indexed, inflation pushes people into higher tax brackets without any increase in real income ("bracket creep").
- **Menu costs.** Changing prices takes effort: reprinting menus and catalogues, renegotiating contracts.
- **Shoe-leather costs.** When inflation is high, holding cash is costly, so people make extra trips to the bank and keep less money on hand. The name comes from wearing out shoes walking to the bank. In a hyperinflation this becomes extreme: people spend their wages the hour they receive them.

### Why central banks aim for about 2%, not zero

If inflation is costly, why not target zero? There are four main reasons most central banks aim for low but positive inflation, and 2% has become the standard number (the US Federal Reserve formally adopted it in 2012).

1. **Measurement bias.** Measured inflation probably overstates the true rise in the cost of living somewhat, so 2% measured inflation may be close to true price stability.
2. **Room to cut interest rates.** In a recession, central banks cut rates to support spending. Nominal rates cannot go much below zero (people would just hold cash). With 2% inflation, normal nominal rates are higher, which leaves more room to cut before hitting this **zero lower bound**.
3. **Downward wage rigidity.** Employers and workers strongly resist cutting nominal wages. With some inflation, real wages can fall when needed (for example, in a declining industry) through raises smaller than inflation, rather than through layoffs.
4. **Deflation is dangerous.** When prices fall, people may delay purchases in anticipation of lower prices, weakening demand further. Deflation also raises the real burden of debts, which are fixed in nominal terms, potentially forcing defaults and spending cuts. Irving Fisher called this **debt deflation** and blamed it for deepening the Great Depression, when US consumer prices fell by about a quarter between 1929 and 1933.

> Moderate, stable, *predictable* inflation is cheap. The serious damage comes from inflation that is high, volatile, or unexpected, and from deflation.
{: .key}

## How central banks fight inflation

In most countries, primary responsibility for inflation rests with the **central bank**: the Federal Reserve (the Fed) in the US, the European Central Bank (ECB) in the euro area, the Bank of England, the Reserve Bank of India, the Bank of Japan, and so on. Most are **independent**: elected governments set their goals, but don't control their day-to-day decisions. The reasoning is that politicians facing an election have an incentive to stimulate the economy now and let inflation arrive later. Delegating to an independent institution with a clear mandate makes it more credible that inflation will be controlled.

The Fed has a **dual mandate** from Congress: maximum employment and stable prices. Many other central banks have a single primary mandate of price stability, usually expressed as an explicit **inflation target**. New Zealand pioneered formal inflation targeting in 1990, and dozens of central banks now follow some version of it.

### The main lever: the policy interest rate

A central bank's main tool is a short-term interest rate. The Fed sets a target range for the **federal funds rate**, the rate at which banks lend reserves to each other overnight. It controls this rate by setting the interest it pays on banks' reserve balances and through related operations. Because banks can always earn that rate risk-free at the Fed, they won't lend to anyone for much less, so the policy rate becomes the floor under all other short-term rates.

Changes in the policy rate spread through the economy along several channels, a process called the **monetary transmission mechanism**:

<div class="flow">
<div class="flow-box flow-box--ghost"><b>Central bank raises its policy rate</b>And signals where it expects rates to go next.</div>
<div class="flow-arrow">pushes up</div>
<div class="flow-box"><b>Market interest rates</b>Mortgages, car loans, credit cards, business loans, and bond yields rise.</div>
<div class="flow-arrow">which</div>
<div class="flow-box"><b>Cools spending</b>Borrowing is costlier and saving more rewarding; stock and house prices tend to fall; the currency strengthens, making imports cheaper.</div>
<div class="flow-arrow">reduces</div>
<div class="flow-box"><b>Demand for goods and labour</b>Firms hire less; job openings fall; wage growth slows.</div>
<div class="flow-arrow">lowers</div>
<div class="flow-box flow-box--accent"><b>Inflation</b>Typically with a lag of one to two years.</div>
<p class="chart-caption">How a rate hike reaches prices. The lags are long and variable, so central banks must act on forecasts rather than on today's data.</p>
</div>

Two points are worth stressing. First, what matters for spending is the **real** interest rate, $$i - \pi^e$$. If inflation is 6% and the central bank raises its rate from 0% to 4%, the real rate is still negative: policy is less loose, but not tight. To actually restrain the economy, the nominal rate must rise above expected inflation. Second, monetary policy works mainly through *demand*. It cannot produce more oil or unclog a port. Against a supply shock it can only reduce inflation by reducing demand, which means accepting weaker growth and higher unemployment.

### The Taylor rule

How high should the rate be? In 1993 John Taylor proposed a simple formula that matched the Fed's actual behaviour in the late 1980s and early 1990s surprisingly well:

$$
i = r^* + \pi + 0.5\,(\pi - \pi^*) + 0.5\,x ,
$$

where $$r^*$$ is the **neutral real rate** (the real rate that neither stimulates nor restrains the economy; Taylor used 2%), $$\pi$$ is inflation over the past year, $$\pi^*$$ is the target (2%), and $$x$$ is the output gap in percent. Rearranged,

$$
i = (r^* + \pi^*) + 1.5\,(\pi - \pi^*) + 0.5\,x .
$$

The coefficient 1.5 on inflation is the important part. It says that for every 1 percentage point of extra inflation, the nominal rate should rise by *more* than 1 point, so that the real rate rises. This is the **Taylor principle**. A central bank that raises rates less than one-for-one with inflation is actually *loosening* policy as inflation rises, which can let inflation spiral.

No central bank follows the rule mechanically, and $$r^*$$ and the output gap cannot be observed directly and must be estimated. But the rule is a widely used benchmark for asking whether policy is too tight or too loose.

<div class="chart">
<script type="application/vnd.vegalite+json">
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "height": 260,
  "params": [
    {"name": "gap", "value": 0, "bind": {"input": "range", "min": -6, "max": 4, "step": 0.5, "name": "Output gap (%) "}},
    {"name": "rstar", "value": 1, "bind": {"input": "range", "min": 0, "max": 3, "step": 0.25, "name": "Neutral real rate r* (%) "}}
  ],
  "data": {"sequence": {"start": 0, "stop": 10.05, "step": 0.1, "as": "pi"}},
  "transform": [
    {"calculate": "max(0, rstar + 2 + 1.5 * (datum.pi - 2) + 0.5 * gap)", "as": "Taylor rule"},
    {"calculate": "datum.pi", "as": "Nominal rate = inflation (zero real rate)"},
    {"fold": ["Taylor rule", "Nominal rate = inflation (zero real rate)"], "as": ["series", "rate"]}
  ],
  "mark": {"type": "line", "strokeWidth": 2.5},
  "encoding": {
    "x": {"field": "pi", "type": "quantitative", "title": "Inflation (%)"},
    "y": {"field": "rate", "type": "quantitative", "title": "Policy rate (%)", "scale": {"domain": [0, 18]}},
    "color": {"field": "series", "type": "nominal", "title": null, "legend": {"orient": "top"}},
    "strokeDash": {"field": "series", "type": "nominal", "title": null},
    "tooltip": [{"field": "series", "type": "nominal"}, {"field": "pi", "type": "quantitative", "title": "Inflation", "format": ".1f"}, {"field": "rate", "type": "quantitative", "title": "Rate", "format": ".2f"}]
  }
}
</script>
<p class="chart-caption">The Taylor rule (with a 2% target) is steeper than the 45° line, so the real rate rises as inflation rises. A recession (negative output gap) shifts the line down; the rule is clipped at zero, the lower bound on rates.</p>
</div>

### Why the response has to be strong enough

The interactive simulation below is a deliberately simple model of an economy hit by a temporary cost shock (an oil price spike lasting a year). It has three equations, each a cartoon of an idea from this article, in quarterly time:

- **Spending** responds to the real interest rate: the output gap $$x_t$$ falls when the real rate $$i_{t-1} - \pi_{t-1}$$ is above neutral.
- **Inflation** equals expected inflation, plus a push from the output gap, plus the shock: $$\pi_t = \pi^e_t + 0.2\,x_t + s_t$$.
- **Expectations** are a mix of the target and last quarter's inflation: $$\pi^e_t = \lambda\,\pi^* + (1-\lambda)\,\pi_{t-1}$$. The anchoring weight $$\lambda$$ measures how much people trust the central bank's target.

The central bank sets its rate with a Taylor-style rule, $$i_t = r^* + \pi^* + \phi\,(\pi_t - \pi^*) + 0.5\,x_t$$, and you choose how aggressively it responds ($$\phi$$).

<div class="chart widget" data-no-annotate="">
<div class="widget-row">
<label for="inf-phi">Response to inflation \(\phi\): <strong id="inf-phival">1.5</strong></label>
<input type="range" id="inf-phi" min="0.5" max="3" step="0.1" value="1.5">
</div>
<div class="widget-row">
<label for="inf-lam">Expectations anchoring \(\lambda\): <strong id="inf-lamval">0.0</strong></label>
<input type="range" id="inf-lam" min="0" max="0.9" step="0.05" value="0">
</div>
<div class="widget-row">
<label for="inf-shock">Shock size (pp per quarter, for 4 quarters): <strong id="inf-shockval">1.5</strong></label>
<input type="range" id="inf-shock" min="0" max="4" step="0.5" value="1.5">
</div>
<canvas id="inf-cv" style="width:100%;height:300px"></canvas>
<output id="inf-out" aria-live="polite"></output>
<p class="chart-caption">With λ = 0 (expectations simply follow past inflation), try φ = 0.8: inflation keeps climbing, because the real rate falls as inflation rises. Compare φ = 1.5 and φ = 2.5: the stronger response restores the target years sooner, through a sharper but shorter slump. Then raise λ to 0.6: with anchored expectations the same shock fades within about a year and a half at little cost, even under a weak response.</p>
</div>

<script>
(function () {
  var cv = document.getElementById('inf-cv'), ctx = cv.getContext('2d');
  var phiIn = document.getElementById('inf-phi'), lamIn = document.getElementById('inf-lam'), shIn = document.getElementById('inf-shock');
  var phiOut = document.getElementById('inf-phival'), lamOut = document.getElementById('inf-lamval'), shOut = document.getElementById('inf-shockval');
  var out = document.getElementById('inf-out');
  var article = document.querySelector('article.article') || document.documentElement;
  var RS = 2, PS = 2, K = 0.2, A = 0.5, RHO = 0.7, T = 48;

  function simulate(phi, lam, shock) {
    var pi = [PS], x = [0], i = [RS + PS];
    for (var t = 1; t < T; t++) {
      var s = (t >= 4 && t < 8) ? shock : 0;
      var xt = RHO * x[t - 1] - A * (i[t - 1] - pi[t - 1] - RS);
      var pe = lam * PS + (1 - lam) * pi[t - 1];
      var pt = pe + K * xt + s;
      var it = Math.max(0, RS + PS + phi * (pt - PS) + 0.5 * xt);
      pi.push(pt); x.push(xt); i.push(it);
    }
    return {pi: pi, x: x, i: i};
  }
  function css(el, name) { return getComputedStyle(el).getPropertyValue(name).trim(); }

  function draw() {
    var phi = +phiIn.value, lam = +lamIn.value, shock = +shIn.value;
    phiOut.textContent = phi.toFixed(1); lamOut.textContent = lam.toFixed(2); shOut.textContent = shock.toFixed(1);
    var r = simulate(phi, lam, shock);
    var all = r.pi.concat(r.x, r.i);
    var lo = Math.min(-2, Math.min.apply(null, all)), hi = Math.max(8, Math.max.apply(null, all));
    var capped = false;
    if (hi > 30) { hi = 30; capped = true; }
    if (lo < -15) { lo = -15; capped = true; }

    var root = document.documentElement, dpr = window.devicePixelRatio || 1;
    var w = cv.clientWidth, h = cv.clientHeight; if (!w) return;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    var L = 40, Rm = 12, Tp = 28, B = 26;
    function X(t) { return L + (w - L - Rm) * t / (T - 1); }
    function Y(v) { v = Math.max(lo, Math.min(hi, v)); return Tp + (h - Tp - B) * (1 - (v - lo) / (hi - lo)); }
    var muted = css(root, '--muted'), grid = css(root, '--border');
    var c1 = css(article, '--topic') || css(root, '--accent'), c2 = css(root, '--accent') || c1;
    ctx.font = '12px ' + css(root, '--font-sans'); ctx.lineWidth = 1;
    var step = (hi - lo) > 24 ? 5 : 2;
    ctx.fillStyle = muted; ctx.strokeStyle = grid; ctx.textAlign = 'right';
    for (var g = Math.ceil(lo / step) * step; g <= hi; g += step) {
      ctx.beginPath(); ctx.moveTo(L, Y(g)); ctx.lineTo(w - Rm, Y(g)); ctx.stroke();
      ctx.fillText(g + '%', L - 6, Y(g) + 4);
    }
    ctx.textAlign = 'center';
    for (var q = 0; q < T; q += 8) ctx.fillText('yr ' + (q / 4), X(q), h - 8);
    ctx.strokeStyle = muted; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(L, Y(0)); ctx.lineTo(w - Rm, Y(0)); ctx.stroke();
    ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(L, Y(PS)); ctx.lineTo(w - Rm, Y(PS)); ctx.stroke(); ctx.setLineDash([]);
    ctx.globalAlpha = 0.12; ctx.fillStyle = c1; ctx.fillRect(X(4), Tp, X(8) - X(4), h - Tp - B); ctx.globalAlpha = 1;

    function curve(arr, color, dash, lw) {
      ctx.strokeStyle = color; ctx.setLineDash(dash); ctx.lineWidth = lw; ctx.beginPath();
      arr.forEach(function (v, t) { if (t === 0) ctx.moveTo(X(t), Y(v)); else ctx.lineTo(X(t), Y(v)); });
      ctx.stroke(); ctx.setLineDash([]);
    }
    curve(r.i, c2, [6, 4], 2);
    curve(r.x, muted, [], 1.8);
    curve(r.pi, c1, [], 2.8);

    var items = [['Inflation', c1, []], ['Policy rate', c2, [6, 4]], ['Output gap', muted, []]], lx = L + 4;
    ctx.textAlign = 'left';
    items.forEach(function (it) {
      ctx.strokeStyle = it[1]; ctx.setLineDash(it[2]); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(lx, 12); ctx.lineTo(lx + 22, 12); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = muted; ctx.fillText(it[0], lx + 28, 16); lx += 28 + ctx.measureText(it[0]).width + 18;
    });

    var peak = Math.max.apply(null, r.pi), worst = Math.min.apply(null, r.x), back = -1;
    for (var t = 8; t < T; t++) { if (Math.abs(r.pi[t] - PS) < 0.25) { var ok = true; for (var u = t; u < T; u++) if (Math.abs(r.pi[u] - PS) >= 0.25) ok = false; if (ok) { back = t; break; } } }
    var lost = 0; r.x.forEach(function (v) { if (v < 0) lost -= v / 4; });
    out.textContent = 'Peak inflation ' + peak.toFixed(1) + '%.  ' +
      (back >= 0 ? 'Back within 0.25 pp of target after ' + ((back - 4) / 4).toFixed(1) + ' years from the shock.  ' : 'Does not return to target within 12 years.  ') +
      'Deepest output gap ' + worst.toFixed(1) + '%.  Cumulative output lost: ' + lost.toFixed(1) + '% of a year’s output.' +
      (capped ? '  (Axis clipped: the paths leave the chart.)' : '');
  }
  [phiIn, lamIn, shIn].forEach(function (el) { el.addEventListener('input', draw); });
  window.addEventListener('resize', draw);
  document.addEventListener('rr:themechange', draw);
  draw();
})();
</script>

The model is a toy, but it captures three real lessons. Responding too weakly lets a temporary shock become permanent inflation. Responding strongly brings inflation down faster but at the cost of a deeper downturn. And credibility, represented by $$\lambda$$, is enormously valuable: when people expect the central bank to restore 2%, inflation falls back almost by itself.

### The Phillips curve and the "sacrifice"

The trade-off in the simulation has a long history. In 1958 A. W. Phillips showed that, in nearly a century of UK data, wage inflation was high when unemployment was low and vice versa. This relationship, the **Phillips curve**, was soon read as a menu: a country could choose permanently lower unemployment by accepting permanently higher inflation.

In 1968 Milton Friedman (and, independently, Edmund Phelps) argued that this was wrong. Once people come to expect the higher inflation, they build it into wages and prices, and unemployment drifts back to its **natural rate**, the level determined by the structure of the labour market. The only lasting result of trying to hold unemployment below that rate is ever-rising inflation. The modern **expectations-augmented Phillips curve** is

$$
\pi_t = \pi^e_t - \beta\,(u_t - u^*) + s_t ,
$$

where $$u_t$$ is unemployment, $$u^*$$ the natural rate, and $$s_t$$ a supply shock. Low unemployment only raises inflation *relative to expectations*. The stagflation of the 1970s, with high inflation and high unemployment together, was a dramatic confirmation of the Friedman–Phelps view.

The equation also explains why bringing inflation down is costly. If expectations are stuck at a high level, the only way to make actual inflation fall below them is to push unemployment above its natural rate for a while. The cumulative output lost per point of inflation reduction is called the **sacrifice ratio**. Credibility reduces it, because it lets expectations fall directly.

### Other central-bank tools

- **Forward guidance.** Central banks announce how they expect to set rates in the future. Because long-term rates (such as mortgage rates) depend on expected future short rates, words alone can move financial conditions.
- **Balance-sheet policy.** When rates hit zero after 2008 and in 2020, central banks bought large amounts of government bonds and other assets (**quantitative easing**, QE) to push down long-term rates. To tighten, they can let those holdings run off (**quantitative tightening**, QT).
- **Exchange-rate policy.** In smaller open economies, a lot of inflation comes through import prices, and some central banks manage or peg their exchange rate to import the price stability of a larger economy.

## What governments can do

Central banks are not the only actors. Elected governments influence inflation through several channels, for better or worse.

**Fiscal policy.** Government spending and taxes affect total demand. Large deficits during a period when the economy is already near capacity add to demand-pull inflation, while cutting deficits does the reverse. Fiscal and monetary policy can therefore pull in the same direction or work against each other. In extreme cases, a government that cannot borrow finances its deficits by having the central bank print money (sometimes called **monetising** the deficit or **fiscal dominance**). This is the root cause of essentially every hyperinflation.

**Protecting central-bank independence.** Much of what governments do about inflation is institutional: writing a clear mandate, appointing credible officials, and not pressuring the central bank to keep rates low before elections.

**Supply-side measures.** Because some inflation comes from supply constraints, policies that increase what the economy can produce help: easing bottlenecks in ports and energy, reducing barriers to building housing, increasing competition, and widening the labour force. These tend to work slowly.

**Targeted relief.** During supply shocks, governments often cushion households directly, for example with energy subsidies or caps on household energy bills (as many European countries did in 2022), or by cutting fuel taxes. These lower measured inflation temporarily and protect vulnerable households, but they are expensive, and by supporting demand they can make underlying inflation harder to fight.

**Price and wage controls.** The most direct approach is simply to forbid price increases. It has a long and mostly unhappy history. The Roman emperor Diocletian's Edict on Maximum Prices in 301 CE set ceilings on more than a thousand goods and was widely evaded. In August 1971 President Nixon froze US wages and prices for 90 days, followed by several phases of looser controls. Inflation came back strongly once the controls were lifted. Controls don't remove the excess demand or the cost pressure behind inflation. They suppress the price signal, which tends to cause shortages, queues, black markets, and lower quality, and the pressure re-emerges when they end.

> Inflation has many possible triggers, but controlling it over time comes down to managing total demand and expectations. That is why the main responsibility usually sits with an independent central bank, while fiscal discipline and institutional credibility make its job possible.
{: .key}

## Four episodes

### The Great Inflation and the Volcker disinflation (US, 1965–1983)

US inflation crept up from under 2% in the early 1960s, driven by spending on the Vietnam War and social programmes, monetary policy that leaned toward keeping unemployment low, and growing tolerance of rising prices. The oil shocks of 1973 and 1979 then pushed it into double digits. Because the Fed had repeatedly let inflation drift up, expectations became unanchored, and each shock pushed inflation to a higher plateau. Twelve-month CPI inflation peaked at 14.8% in March 1980.

Paul Volcker became Fed chair in August 1979. In October 1979 the Fed changed its operating procedures to restrict the growth of bank reserves, which let short-term interest rates rise as high as necessary. The federal funds rate reached close to 20%. The result was a severe recession, with unemployment reaching 10.8% in late 1982. But inflation fell to around 3–4% by 1983 and stayed low. The episode established the modern view that a determined central bank can end high inflation, that doing so is costly when credibility is low, and that it is far better never to lose control in the first place.

### German hyperinflation (1921–1923)

After the First World War, Germany faced large war debts and reparation payments to the Allies, and it financed government deficits by printing money. After France and Belgium occupied the Ruhr industrial region in January 1923, and the government paid striking workers there with newly printed marks, inflation exploded. In 1914 a US dollar cost about 4.2 marks. By November 1923 it cost about 4.2 *trillion*. Prices were rising so fast that workers were paid twice a day and spent their wages immediately.

The hyperinflation ended abruptly in November 1923 with a currency reform: a new currency, the Rentenmark, exchanged at one for one trillion paper marks, combined with a halt to the printing of money to fund the deficit and, soon after, a renegotiation of reparations. As Thomas Sargent argued in a study of four such episodes, these hyperinflations ended quickly once a credible change of fiscal and monetary regime removed the reason for money creation, which is the clearest evidence for the role of expectations.

Other examples include Hungary in 1946, the most extreme on record, where prices at the peak doubled roughly every 15 hours, and Zimbabwe in 2007–2009, where the central bank issued a 100-trillion-dollar note before the country abandoned its own currency in favour of foreign ones.

### Japan's long low-inflation trap (late 1990s–2010s)

After a stock and real-estate bubble burst in the early 1990s, Japan experienced years of weak growth and, from the late 1990s, mild but persistent deflation. With interest rates near zero, the Bank of Japan had little room to stimulate the economy in the conventional way, and expectations of low or falling prices became entrenched. The Bank adopted a 2% target in 2013, then massive asset purchases and, from 2016, a slightly negative policy rate. Inflation remained below target for most of the following decade. Japan's experience is the main reason central banks fear deflation and the zero lower bound, and why they prefer a target above zero.

### The pandemic-era surge (2021–2023)

In 2021 inflation rose rapidly across most advanced economies. In the US, twelve-month CPI inflation peaked at 9.1% in June 2022, the highest since 1981. Euro-area inflation peaked above 10% in late 2022, and UK inflation at 11.1%.

Several forces combined. Demand was boosted by very large fiscal support (in the US, about \$2.2 trillion in the CARES Act in 2020 and \$1.9 trillion in the American Rescue Plan in 2021), near-zero interest rates, and households' accumulated savings. Spending shifted sharply from services to goods just as factory closures and shipping bottlenecks constrained supply. Then Russia's invasion of Ukraine in February 2022 drove up energy and food prices. Bernanke and Blanchard (2023) estimate that supply shocks and energy and food prices drove most of the initial surge, with tight labour markets becoming more important as the episode went on.

Central banks were initially slow to react, on the view that the shocks would be "transitory". The Fed began raising rates in March 2022 and lifted its target range from near zero to 5.25–5.50% by July 2023, the fastest tightening since the early 1980s, including four consecutive 0.75-point increases in 2022. Inflation fell substantially through 2023 and 2024. Unusually, unemployment stayed low during the disinflation, which many economists attribute to the fading of supply shocks and to long-term inflation expectations remaining fairly well anchored. The Fed began cutting rates in September 2024, though inflation remained somewhat above the 2% target into 2025.

## Reading inflation news

A short glossary for the monthly headlines.

- **"Prices rose 0.3% last month."** Monthly changes are small numbers that compound. 0.3% a month is $$1.003^{12} - 1 \approx 3.7\%$$ annualised. 0.5% a month is about 6.2% a year. Monthly figures are seasonally adjusted and noisy, so analysts often look at three- or six-month annualised rates.
- **"Year-over-year" (y/y)**: the change from the same month a year earlier. This is the standard headline number. It is slow to react: a sudden change in the monthly trend takes a year to fully show up, and an old shock can keep the year-over-year rate high until it drops out (**base effects**).
- **Basis point**: one hundredth of a percentage point. A 25 basis-point hike raises the policy rate by 0.25 points.
- **Hawkish / dovish**: a hawk favours tighter policy to fight inflation; a dove puts more weight on supporting employment.
- **Breakeven inflation**: the difference between the yield on an ordinary Treasury bond and a TIPS bond of the same maturity. It approximates the inflation rate markets expect, which is one way to check whether expectations are anchored. Surveys of households and professional forecasters are another.
- **Soft landing**: bringing inflation down without causing a recession.
- **Sticky vs. flexible prices**: some prices (petrol, airfares) change constantly; others (rent, insurance, many services) adjust slowly. Services inflation and shelter tend to be the slowest to come down after a surge.

> When you see a headline inflation number, it helps to ask: Is this headline or core? CPI or PCE? Monthly or year-over-year? Is the trend over the last few months higher or lower than the year-over-year figure?
{: .note}

## Summary

- **Inflation** is a sustained rise in the general price level, measured by the percentage change in a price index such as the CPI, which tracks the cost of a fixed basket weighted by spending shares. Core measures strip out volatile food and energy; the Fed targets 2% PCE inflation.
- **Causes**: excess demand, supply shocks that raise costs, and, over the long run, money growing faster than output. **Expectations** determine whether an initial shock fades or becomes persistent.
- **Effects**: unexpected inflation transfers wealth from lenders and fixed-income earners to borrowers and erodes real wages when pay lags prices. Even steady inflation adds uncertainty and distortions. But deflation and the zero lower bound are dangerous too, which is why central banks aim for about 2% rather than zero.
- **Policy**: central banks fight inflation mainly by raising interest rates enough to push the **real** rate up (the Taylor principle), cooling demand with a lag of a year or more. Credibility and independence make this much cheaper. Governments help through fiscal discipline and supply-side measures; price controls suppress symptoms rather than causes.
- **History**: the 1970s showed the cost of letting expectations drift; Volcker showed that inflation can be ended at a price; hyperinflations show what happens when governments print money to pay their bills; Japan shows the opposite danger; and 2021–23 showed how supply shocks and strong demand can combine, and how anchored expectations can make disinflation less painful.
