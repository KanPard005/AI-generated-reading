---
title: "Erdős–Rényi Random Graphs"
subtitle: "Flip a coin for every pair of vertices. Thresholds, the giant component, connectivity, cliques and the proof techniques that every random-graph paper relies on."
topic: science
tags: [random-graphs, probability, combinatorics, phase-transitions, network-science]
reading_time: 60
date: 2026-11-01
level: advanced
summary: "Defines G(n,p) and G(n,m), builds the first- and second-moment toolkit, and proves the main structural theorems: existence of thresholds, subgraph thresholds, the connectivity threshold at log n / n, the emergence of the giant component at np = 1, and the 2 log n clique number. Ends with zero–one laws and the models that extend Erdős–Rényi in modern papers."
brief: "A semi-extensive note on Erdős–Rényi graphs: what they are, the important theorems with proofs, and the key properties, aimed at building intuition and confidence for reading research papers."
references:
  - title: "Erdős & Rényi (1959). On random graphs I. Publicationes Mathematicae Debrecen 6."
    note: "The G(n,m) model and the connectivity threshold."
  - title: "Erdős & Rényi (1960). On the evolution of random graphs. Publ. Math. Inst. Hung. Acad. Sci. 5."
    note: "The founding paper: thresholds, the giant component, the double jump at n/2 edges."
  - title: "Gilbert (1959). Random graphs. Annals of Mathematical Statistics 30."
    note: "Introduces the G(n,p) model independently."
  - title: "Erdős (1947). Some remarks on the theory of graphs. Bulletin of the AMS 53."
    note: "The probabilistic lower bound on Ramsey numbers."
  - title: "Bollobás & Thomason (1987). Threshold functions. Combinatorica 7."
    note: "Every monotone property has a threshold."
  - title: "Friedgut (1999). Sharp thresholds of graph properties, and the k-SAT problem. JAMS 12."
    note: "Characterises coarse thresholds as 'local'."
  - title: "Park & Pham (2024). A proof of the Kahn–Kalai conjecture. JAMS 37 (arXiv 2022)."
    note: "Thresholds are within a log factor of the expectation threshold."
  - title: "Aldous (1997). Brownian excursions, critical random graphs and the multiplicative coalescent. Annals of Probability 25."
    note: "Scaling limit inside the critical window."
  - title: "Riordan & Wormald (2010). The diameter of sparse random graphs. Combinatorics, Probability and Computing 19."
  - title: "Bollobás (1988). The chromatic number of random graphs. Combinatorica 8."
  - title: "Fagin (1976). Probabilities on finite models. Journal of Symbolic Logic 41."
    note: "The first-order zero–one law (also Glebskii et al., 1969)."
  - title: "Alon & Spencer. The Probabilistic Method (4th ed., 2016). Wiley."
    note: "Chapters on the second moment method, Janson's inequality, martingales and random graphs. The best place for the toolkit."
  - title: "Janson, Łuczak & Ruciński (2000). Random Graphs. Wiley."
    note: "Standard reference for thresholds, Poisson approximation, the phase transition."
  - title: "Frieze & Karoński (2016). Introduction to Random Graphs. Cambridge University Press."
    note: "Readable, free draft online. Good chapters on connectivity, matchings and Hamilton cycles."
  - title: "van der Hofstad (2017). Random Graphs and Complex Networks, Vol. 1. Cambridge University Press."
    note: "Branching-process approach to the giant component; then configuration and inhomogeneous models."
---

Take $$n$$ labelled vertices and, independently for each of the $$\binom{n}{2}$$ pairs, draw an edge with probability $$p$$. That is the whole model. Yet if you let $$p$$ grow slowly from $$0$$ to $$1$$ and watch, the graph does not change gradually. Triangles go from absent to present over a window of constant factor. At average degree $$1$$ a component containing a constant fraction of all vertices appears out of a sea of tiny trees. At average degree $$\log n$$ the last isolated vertex is absorbed and the graph becomes connected, almost exactly at that moment.

These abrupt changes, called *thresholds* or *phase transitions*, are the main subject of the theory Erdős and Rényi started in 1959–60. The proofs use a small toolkit (first and second moments, Chernoff bounds, branching processes, martingales) that appears in almost every paper on random graphs, random constraint satisfaction, community detection and network models. This note works through the central results with proofs, aiming for the intuition you need to read those papers.

> **Notation.** $$\log$$ is natural. $$N=\binom n2$$. Asymptotics are as $$n\to\infty$$ with $$p=p(n)$$. $$a_n \ll b_n$$ means $$a_n/b_n\to 0$$, and $$\omega(n)$$ denotes any function tending to infinity (arbitrarily slowly). An event holds **with high probability (whp)**, or *asymptotically almost surely*, if its probability tends to $$1$$. $$(x)_r = x(x-1)\cdots(x-r+1)$$ is the falling factorial.
{: .aside}

## 1. The models and how to think about them

### Two definitions

> **Definition ($$G(n,p)$$, Gilbert 1959).** The random graph on vertex set $$[n]=\{1,\dots,n\}$$ in which each of the $$N$$ possible edges is present independently with probability $$p$$. A fixed graph $$G$$ with $$e(G)$$ edges has probability
>
> $$
> \Pr\big(G(n,p)=G\big) = p^{e(G)}(1-p)^{N-e(G)}.
> $$
{: .definition}

> **Definition ($$G(n,m)$$, Erdős–Rényi 1959).** A graph chosen uniformly at random among all $$\binom{N}{m}$$ graphs on $$[n]$$ with exactly $$m$$ edges.
{: .definition}

Erdős and Rényi worked with $$G(n,m)$$. Today almost everyone uses $$G(n,p)$$, because independence of edges makes calculations easy, and still calls it the Erdős–Rényi graph. The two are nearly interchangeable:

- Conditioned on having exactly $$m$$ edges, $$G(n,p)$$ is distributed as $$G(n,m)$$.
- The number of edges of $$G(n,p)$$ is $$\mathrm{Bin}(N,p)$$, concentrated at $$Np \pm O(\sqrt{Np})$$.

So for properties that are monotone (defined below), $$G(n,p)$$ and $$G(n,m)$$ with $$m\approx Np$$ have the same asymptotic behaviour. More precisely, if a monotone property holds whp in $$G(n,m)$$ for every $$m$$ with $$\lvert m-Np\rvert \le \omega\sqrt{Np}$$, it holds whp in $$G(n,p)$$, and conversely with small adjustments. The translation is $$m = pn^2/2$$, so "$$m = cn/2$$ edges" is "average degree $$c$$", which is $$p=c/n$$.

### Monotone properties and the coupling

A graph property $$\mathcal A$$ (a set of graphs closed under relabelling) is **increasing** if adding edges cannot destroy it: connectivity, containing a triangle, having a Hamilton cycle, having a component of size $$\ge n/2$$. It is decreasing if its complement is increasing: being planar, being 3-colourable, being triangle-free. (Careful with negations: "no isolated vertex" is increasing.)

The most useful single idea for monotone properties is the **standard coupling**. Give every pair $$e$$ an independent uniform label $$U_e\in[0,1]$$, and set

$$
G_p = \{\,e : U_e \le p\,\}.
$$

Then $$G_p \sim G(n,p)$$ for every $$p$$ simultaneously, and $$G_p\subseteq G_{p'}$$ for $$p\le p'$$. Sorting the edges by their labels and adding them one at a time gives the **random graph process** $$G_0\subset G_1\subset\cdots\subset G_N$$, where $$G_m\sim G(n,m)$$. Two consequences:

1. For increasing $$\mathcal A$$, $$p\mapsto\Pr(G(n,p)\in\mathcal A)$$ is nondecreasing. (It is a polynomial in $$p$$, hence continuous.)
2. One can ask *hitting-time* questions: at which step $$m$$ of the process does the graph first become connected, and is that the same step at which the minimum degree first becomes $$1$$? These are stronger than threshold statements.

The interactive figure in Section 6 uses exactly this coupling, so moving the slider adds edges to one fixed graph rather than drawing a new one.

### The evolution at a glance

Most of this note proves pieces of the following table. Read it once now, and come back to it.

| Regime | Typical structure of $$G(n,p)$$ |
|---|---|
| $$p\ll n^{-2}$$ | No edges. |
| $$n^{-k/(k-1)} \ll p \ll n^{-(k+1)/k}$$ | A forest whose components are trees with at most $$k$$ vertices; every such tree appears. |
| $$p=c/n,\ c<1$$ | Subcritical: components have $$O(\log n)$$ vertices; almost all are trees, a bounded number contain one cycle. |
| $$p=(1+\lambda n^{-1/3})/n$$ | Critical window: the largest components have order $$n^{2/3}$$. |
| $$p=c/n,\ c>1$$ | Supercritical: a unique *giant* component with $$\approx\zeta_c n$$ vertices; all others $$O(\log n)$$. |
| $$p=(\log n+c)/n$$ | Isolated vertices disappear; connected with probability $$\to e^{-e^{-c}}$$. |
| $$p=(\log n+\log\log n + c)/n$$ | Hamiltonian with probability $$\to e^{-e^{-c}}$$. |
| $$p$$ constant | Dense: diameter $$2$$, clique number $$\approx 2\log_{1/p} n$$, chromatic number $$\approx n/(2\log_{1/(1-p)} n)$$. |

The scale $$p\asymp 1/n$$ (constant average degree) is called the **sparse** regime and is where most of the interesting structure lives. Many applied papers (community detection, message passing, random CSPs) work exactly there.

## 2. The local picture

### Degrees are Poisson

Each vertex has degree $$\mathrm{Bin}(n-1,p)$$, with mean $$(n-1)p$$.

> **Proposition 1.** If $$p=c/n$$ with $$c$$ fixed, then for each fixed $$k$$, $$\Pr(\deg v=k)\to e^{-c}c^k/k!$$. Moreover the fraction of vertices of degree $$k$$ converges in probability to $$e^{-c}c^k/k!$$.
{: .theorem}

> **Proof.** $$\binom{n-1}{k}p^k = \frac{(n-1)_k}{k!}\frac{c^k}{n^k}\to\frac{c^k}{k!}$$ and $$(1-p)^{n-1-k}\to e^{-c}$$. For the second claim, let $$Y_k$$ count the vertices of degree $$k$$. Then $$\mathbb E Y_k = n\Pr(\deg v=k)$$. For two vertices $$u\ne v$$, their degrees depend on each other only through the single pair $$uv$$, and conditioning on that edge changes each degree by at most one, so $$\Pr(\deg u=\deg v=k)=\Pr(\deg v = k)^2+O(1/n)$$. Hence $$\mathrm{Var}\,Y_k = O(n)$$, so $$Y_k/n$$ concentrates by Chebyshev.
{: .proof}

The Poisson degree distribution has light tails: the maximum degree in $$G(n,c/n)$$ is only about $$\log n/\log\log n$$. That is the first big way Erdős–Rényi graphs differ from real networks (Section 9).

When $$np\gg\log n$$ the degrees concentrate: by a Chernoff bound and a union bound, every degree is $$(1\pm\varepsilon)np$$ whp. Dense Erdős–Rényi graphs are nearly regular.

### Short cycles are rare, so neighbourhoods are trees

The expected number of cycles of length $$k$$ is

$$
\frac{(n)_k}{2k}\,p^k \;\longrightarrow\; \frac{c^k}{2k}\qquad (p=c/n),
$$

since a $$k$$-cycle is an ordered sequence of $$k$$ distinct vertices up to $$k$$ rotations and $$2$$ directions. So the whole graph contains only a bounded number of short cycles, and the count of $$k$$-cycles is asymptotically $$\mathrm{Poisson}(c^k/2k)$$. A fixed vertex $$v$$ is within distance $$r$$ of a cycle of length at most $$\ell$$ with probability $$O(1/n)$$: such a configuration (a cycle plus a path to $$v$$) has as many edges as vertices, say $$j$$ of each. With $$v$$ fixed there are $$O(n^{j-1})$$ placements, each present with probability $$p^j=c^j/n^j$$.

Combine this with Proposition 1 and you get the most important heuristic in the sparse regime:

> **Local tree-likeness.** For $$p=c/n$$, the ball of fixed radius $$r$$ around a uniformly random vertex converges in distribution to the first $$r$$ generations of a Galton–Watson tree with $$\mathrm{Poisson}(c)$$ offspring. (In modern language: $$G(n,c/n)$$ converges locally weakly to the Poisson($$c$$) Galton–Watson tree.)
{: .key}

This is why belief propagation, cavity calculations and branching-process arguments work on sparse random graphs: locally, there are no loops to worry about. The tree picture holds for radii up to about $$\tfrac12\log_c n$$; beyond that, balls have $$\sqrt n$$ vertices and start to collide.

## 3. The toolkit

Nearly every proof below is one of four moves.

### First moment method

For a nonnegative integer random variable $$X$$,

$$
\Pr(X>0)\le \mathbb E X .
$$

(Markov's inequality.) To show a structure does *not* exist whp, show its expected count tends to $$0$$. Union bounds are the same thing.

### Second moment method

$$\mathbb E X\to\infty$$ does not imply $$X>0$$ whp; the expectation may come from rare events with huge counts. If the variance is small relative to the mean squared, it does:

$$
\Pr(X=0)\le \Pr\big(\lvert X-\mathbb EX\rvert\ge\mathbb EX\big)\le\frac{\mathrm{Var}\,X}{(\mathbb EX)^2},
\qquad
\Pr(X>0)\ge\frac{(\mathbb EX)^2}{\mathbb E[X^2]} .
$$

The first is Chebyshev; the second is Cauchy–Schwarz applied to $$X=X\mathbf 1_{X>0}$$ (the Paley–Zygmund form). In random graphs $$X$$ is usually a sum of indicators $$X=\sum_A I_A$$ over potential copies $$A$$ of some structure. Write $$A\sim B$$ if $$A\ne B$$ and they share at least one edge (otherwise $$I_A$$ and $$I_B$$ are independent). Then

$$
\mathrm{Var}\,X \le \mathbb EX + \Delta,\qquad \Delta=\sum_{A\sim B}\Pr(I_A=I_B=1),
$$

with the sum over ordered pairs. So:

> **Lemma 2 (second moment for counts).** If $$\mathbb EX\to\infty$$ and $$\Delta=o\big((\mathbb EX)^2\big)$$, then $$X>0$$ whp, and in fact $$X/\mathbb EX\to 1$$ in probability.
{: .theorem}

### Chernoff bounds

For $$X\sim\mathrm{Bin}(m,q)$$ with mean $$\mu$$ (or any sum of independent $$[0,1]$$ variables) and $$\delta>0$$,

$$
\Pr\big(X\ge(1+\delta)\mu\big)\le\exp\!\Big(-\frac{\delta^2\mu}{2+\delta}\Big),\qquad
\Pr\big(X\le(1-\delta)\mu\big)\le\exp\!\Big(-\frac{\delta^2\mu}{2}\Big).
$$

These control edge counts, degrees and the exploration random walks of Section 6.

### Poisson approximation by moments

When $$\mathbb EX$$ tends to a constant, the interesting statement is the limiting *distribution*. The method of moments for factorial moments says: if $$\mathbb E[(X)_r]\to\lambda^r$$ for every fixed $$r$$, then $$X\to\mathrm{Poisson}(\lambda)$$ in distribution, so $$\Pr(X=0)\to e^{-\lambda}$$. For counts, $$\mathbb E[(X)_r]$$ is the expected number of ordered $$r$$-tuples of *distinct* copies, which is usually easy to estimate: disjoint tuples give $$\lambda^r$$ and overlapping tuples are negligible.

Two further tools are worth knowing by name. **Janson's inequality** gives $$\Pr(X=0)\le e^{-\mu+\Delta/2}$$ (exponentially small rather than Chebyshev's polynomial bound), which matters when you need a union bound over many sets. **Martingale concentration** (Azuma–Hoeffding on the edge- or vertex-exposure martingale) gives concentration for Lipschitz functions such as the chromatic number; see Section 7.

## 4. Thresholds

> **Definition.** $$p^*(n)$$ is a **threshold** for an increasing property $$\mathcal A$$ if $$\Pr(G(n,p)\in\mathcal A)\to 0$$ when $$p\ll p^*$$ and $$\to 1$$ when $$p\gg p^*$$. It is a **sharp threshold** if for every $$\varepsilon>0$$ the probability tends to $$0$$ for $$p\le(1-\varepsilon)p^*$$ and to $$1$$ for $$p\ge(1+\varepsilon)p^*$$. A threshold that is not sharp is **coarse**.
{: .definition}

### Every monotone property has a threshold

> **Theorem 3 (Bollobás–Thomason 1987).** Every increasing property that is nontrivial for each $$n$$ has a threshold.
{: .theorem}

The proof is a five-line coupling argument, and the idea (union of independent copies) is reused often.

> **Proof.** Let $$f(p)=\Pr(G(n,p)\in\mathcal A)$$, continuous and increasing from $$0$$ to $$1$$, and let $$p_{1/2}$$ satisfy $$f(p_{1/2})=1/2$$. The union of $$k$$ independent copies of $$G(n,p)$$ is distributed as $$G\big(n,1-(1-p)^k\big)$$, and $$1-(1-p)^k\le kp$$. Since $$\mathcal A$$ is increasing, the union lacks $$\mathcal A$$ only if every copy does, so
>
> $$
> 1-f\big(1-(1-p)^k\big)\le\big(1-f(p)\big)^k .
> $$
>
> *Upper side.* Put $$p=p_{1/2}$$. By monotonicity $$1-f(kp_{1/2})\le 1-f(1-(1-p_{1/2})^k)\le 2^{-k}$$.
>
> *Lower side.* Put $$p=p_{1/2}/k$$. Then $$1-(1-p)^k\le p_{1/2}$$, so the left side is at least $$1/2$$, giving $$(1-f(p_{1/2}/k))^k\ge 1/2$$, i.e. $$f(p_{1/2}/k)\le 1-2^{-1/k}\le (\log 2)/k$$.
>
> If $$p\gg p_{1/2}$$, take $$k=\lfloor p/p_{1/2}\rfloor\to\infty$$ in the first bound; if $$p\ll p_{1/2}$$, take $$k=\lfloor p_{1/2}/p\rfloor$$ in the second. So $$p_{1/2}$$ is a threshold.
{: .proof}

Theorem 3 says nothing about sharpness. **Friedgut's theorem** (1999) does, roughly: a property has a coarse threshold only if it is approximately "local", meaning it is well approximated by containing one of a bounded collection of small subgraphs. So containing a triangle has a coarse threshold (Theorem 4), while connectivity, Hamiltonicity, having a giant component and (in the sparse regime) non-$$k$$-colourability have sharp thresholds. This is the right mental model: *global* properties switch on sharply; *local* ones switch on gradually.

### Small subgraphs

For a fixed graph $$H$$ with $$v_H$$ vertices and $$e_H$$ edges, let $$X_H$$ count copies of $$H$$ in $$G(n,p)$$. Then $$\mathbb EX_H\asymp n^{v_H}p^{e_H}$$, which is $$\Theta(1)$$ at $$p=n^{-v_H/e_H}$$. That is the right threshold only if $$H$$ has no denser part. Define the **maximum density**

$$
m(H)=\max_{H'\subseteq H,\ v_{H'}>0}\ \frac{e_{H'}}{v_{H'}} .
$$

> **Theorem 4 (Erdős–Rényi 1960; Bollobás 1981).** The threshold for $$G(n,p)$$ to contain a copy of $$H$$ is $$n^{-1/m(H)}$$.
{: .theorem}

Why the maximum: take $$H$$ = $$K_4$$ plus a pendant edge. Then $$e_H/v_H=7/5$$ but $$K_4$$ alone has density $$6/4$$. At $$p=n^{-5/7}$$ the expected number of copies of $$H$$ is large, but $$K_4$$s themselves are absent (since $$n^4p^6 = n^{-2/7}\to 0$$). When a $$K_4$$ appears at $$p\approx n^{-2/3}$$, each one has $$\Theta(np)$$ possible pendant edges, so the whole $$H$$ appears at once. The expectation was inflated by rare events: whenever a $$K_4$$ is present, it generates many copies of $$H$$. This is the canonical example of why first moments alone can mislead.

Here is the full proof for triangles; the general balanced case is the same calculation.

> **Proof for $$H=K_3$$.** $$\mathbb EX=\binom n3p^3\sim(np)^3/6$$. If $$np\to 0$$, $$\Pr(X>0)\le\mathbb EX\to 0$$.
>
> If $$np\to\infty$$, use Lemma 2. Two distinct triangles are dependent only if they share an edge, hence exactly two vertices; the union then has $$4$$ vertices and $$5$$ edges. The number of such ordered pairs is $$O(n^4)$$, so $$\Delta=O(n^4p^5)$$ and
>
> $$
> \frac{\Delta}{(\mathbb EX)^2}=O\!\Big(\frac{n^4p^5}{n^6p^6}\Big)=O\!\Big(\frac1{n^2p}\Big)\to 0 .
> $$
>
> Triangles sharing only a vertex share no edge and are independent, so they do not enter $$\Delta$$.
{: .proof}

At the threshold itself the count has a Poisson limit.

> **Proposition 5.** For $$p=c/n$$, $$X_{K_3}\to\mathrm{Poisson}(c^3/6)$$. In particular $$\Pr(\text{triangle-free})\to e^{-c^3/6}$$.
{: .theorem}

> **Proof sketch.** $$\mathbb E[(X)_r]$$ sums over ordered $$r$$-tuples of distinct triangles. Tuples of pairwise vertex-disjoint triangles contribute $$(1+o(1))\big(\binom n3p^3\big)^r\to(c^3/6)^r$$. Any other tuple has a connected union $$F$$ of at least two distinct triangles. A connected graph made of two or more distinct cycles has cyclomatic number $$e_F-v_F+1\ge 2$$, so $$e_F\ge v_F+1$$, and the expected number of copies of $$F$$ is $$O(n^{v_F}p^{e_F})=O(c^{e_F}n^{v_F-e_F})=O(1/n)$$. There are boundedly many shapes for fixed $$r$$, so overlapping tuples contribute $$o(1)$$.
{: .proof}

A simulation with $$n=3000$$ and 300 graphs per row:

| $$c$$ | mean triangles | $$c^3/6$$ | $$\Pr(\text{none})$$, simulated | $$e^{-c^3/6}$$ |
|---:|---:|---:|---:|---:|
| 1.0 | 0.17 | 0.167 | 0.837 | 0.846 |
| 1.5 | 0.61 | 0.563 | 0.533 | 0.570 |
| 2.0 | 1.30 | 1.333 | 0.273 | 0.264 |

The threshold is coarse: the probability moves smoothly from $$0$$ to $$1$$ as $$c$$ ranges over $$(0,\infty)$$, with no window shrinking around a single value. This is Friedgut's "local" case.

This argument is a template. Whenever a paper shows that some small pattern appears with a Poisson number of copies, the proof is this one: disjoint copies contribute the main term, and overlaps have more edges than vertices.

## 5. Connectivity

The obstruction to connectivity that disappears last is the simplest possible one: an isolated vertex. A vertex is isolated with probability $$(1-p)^{n-1}\approx e^{-np}$$, so the expected number of isolated vertices is about $$ne^{-np}$$, which crosses $$1$$ at $$np=\log n$$. The theorem says nothing else matters.

> **Theorem 6 (Erdős–Rényi 1959).** Let $$p=(\log n+c)/n$$ with $$c\in\mathbb R$$ fixed. Then
>
> $$
> \Pr\big(G(n,p)\text{ is connected}\big)\;\to\;e^{-e^{-c}} .
> $$
>
> Consequently $$\log n/n$$ is a sharp threshold for connectivity: $$p=(\log n-\omega)/n$$ gives a disconnected graph whp and $$p=(\log n+\omega)/n$$ a connected one.
{: .theorem}

> **Proof.** *Step 1: isolated vertices are Poisson.* Let $$X_0$$ count isolated vertices. For a fixed set of $$r$$ vertices to be isolated, the $$\binom r2$$ pairs inside it and the $$r(n-r)$$ pairs leaving it must all be absent, which is $$r(n-1)-\binom r2$$ pairs. Hence
>
> $$
> \mathbb E[(X_0)_r]=(n)_r\,(1-p)^{r(n-1)-\binom r2}.
> $$
>
> With $$np=\log n+c$$ and $$p\to 0$$, $$(1-p)^{n-1}=\exp\big(-np+O(np^2)\big)=(1+o(1))\,e^{-c}/n$$, and $$(1-p)^{-\binom r2}\to 1$$. So $$\mathbb E[(X_0)_r]\to e^{-cr}$$ for each $$r$$, and $$X_0\to\mathrm{Poisson}(e^{-c})$$. In particular $$\Pr(X_0=0)\to e^{-e^{-c}}$$.
>
> *Step 2: no other small components.* A set $$S$$ of $$k$$ vertices is a component only if $$G[S]$$ contains a spanning tree and no edge leaves $$S$$. By Cayley's formula there are $$k^{k-2}$$ trees on $$S$$, and the tree edges are disjoint from the pairs leaving $$S$$, so
>
> $$
> \Pr(\exists\text{ component of size }k)\le\binom nk k^{k-2}p^{k-1}(1-p)^{k(n-k)} .
> $$
>
> For $$2\le k\le\sqrt n$$: use $$\binom nk\le(en/k)^k$$ and $$(1-p)^{k(n-k)}\le e^{-pkn}e^{pk^2}$$ with $$pk^2\le k(\log n+c)/\sqrt n\le k$$. The term is at most
>
> $$
> \frac1{k^2p}\big(e\,np\,e^{-np}\,e\big)^k=\frac{n}{k^2(\log n+c)}\Big(\frac{e^{2-c}(\log n+c)}{n}\Big)^k ,
> $$
>
> which for $$k\ge2$$ is $$O(\log n/n)$$ times a geometrically decreasing factor. The sum over these $$k$$ is $$O(\log n/n)$$.
> For $$\sqrt n<k\le n/2$$: now $$n-k\ge n/2$$, so $$(1-p)^{k(n-k)}\le e^{-knp/2}=(e^{-c/2}/\sqrt n)^k$$, and the term is at most $$n\,(C\log n/\sqrt n)^k$$, which is smaller than any power of $$n$$ since $$k>\sqrt n$$.
>
> *Step 3: combine.* A disconnected graph has a component with at most $$n/2$$ vertices. By Step 2, whp that component is a single vertex. So $$\Pr(\text{connected})=\Pr(X_0=0)+o(1)\to e^{-e^{-c}}$$.
{: .proof}

The structure of this proof is worth memorising: **find the cheapest obstruction, show it has a Poisson count, and union-bound everything else away.** The union bound in Step 2 works because a component of size $$k\ge2$$ costs roughly $$k$$ factors of $$e^{-np}=e^{-c}/n$$ (one per vertex, for the missing outside edges) while only gaining $$n^k$$ placements and $$p^{k-1}$$ for internal edges. Larger components are exponentially more expensive.

<div class="chart">
<script type="application/vnd.vegalite+json">
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "height": 250,
  "layer": [
    {
      "data": {"sequence": {"start": -2.5, "stop": 4.01, "step": 0.05, "as": "c"}},
      "transform": [{"calculate": "exp(-exp(-datum.c))", "as": "prob"}, {"calculate": "'Limit e^(-e^(-c))'", "as": "series"}],
      "mark": {"type": "line", "strokeWidth": 2},
      "encoding": {
        "x": {"field": "c", "type": "quantitative", "title": "c, where p = (log n + c)/n"},
        "y": {"field": "prob", "type": "quantitative", "title": "P(connected)", "scale": {"domain": [0, 1]}},
        "color": {"field": "series", "type": "nominal", "title": null, "legend": {"orient": "bottom-right"}}
      }
    },
    {
      "data": {"values": [
        {"c": -1.5, "prob": 0.010}, {"c": -1.0, "prob": 0.050}, {"c": -0.5, "prob": 0.183},
        {"c": 0.0, "prob": 0.340}, {"c": 0.5, "prob": 0.583}, {"c": 1.0, "prob": 0.713},
        {"c": 1.5, "prob": 0.810}, {"c": 2.0, "prob": 0.870}, {"c": 3.0, "prob": 0.933}
      ]},
      "transform": [{"calculate": "'Simulated, n = 2000 (300 graphs each)'", "as": "series"}],
      "mark": {"type": "point", "filled": true, "size": 60},
      "encoding": {
        "x": {"field": "c", "type": "quantitative"},
        "y": {"field": "prob", "type": "quantitative"},
        "color": {"field": "series", "type": "nominal", "title": null},
        "tooltip": [{"field": "c", "type": "quantitative"}, {"field": "prob", "type": "quantitative", "format": ".3f"}]
      }
    }
  ]
}
</script>
<p class="chart-caption">Connectivity probability across the window p = (log n + c)/n. Across the 2,700 simulated graphs, "connected" and "no isolated vertex" disagreed in only 4, as Step 3 predicts.</p>
</div>

In the simulation the window has width $$O(1/n)$$ in $$p$$ around $$\log n/n$$, which is what "sharp threshold" means quantitatively: the transition happens over a relative width $$O(1/\log n)$$.

### Hitting times and relatives

The proof suggests something stronger, and it is true. In the random graph process, let $$\tau_1$$ be the first step at which the minimum degree is at least $$1$$ and $$\tau_{\mathrm{conn}}$$ the first step at which the graph is connected. Then $$\tau_1=\tau_{\mathrm{conn}}$$ whp (Bollobás–Thomason 1985): the very edge that covers the last isolated vertex connects the graph. Similar statements, with the same proof philosophy, hold for:

- **Perfect matchings** ($$n$$ even): same threshold and hitting time as minimum degree $$1$$ (Erdős–Rényi 1966 for the threshold).
- **Hamilton cycles**: threshold $$(\log n+\log\log n+c)/n$$ with limit probability $$e^{-e^{-c}}$$ (Komlós–Szemerédi 1983), and the hitting time equals that of minimum degree $$2$$ (Bollobás 1984; Ajtai–Komlós–Szemerédi 1985).
- **$$k$$-connectivity**: hitting time equals that of minimum degree $$k$$.

> **Rule of thumb.** In $$G(n,p)$$, global properties whose obvious local obstruction is a low-degree vertex hold as soon as that obstruction disappears. Minimum-degree thresholds are easy to compute: $$\Pr(\delta(G)\ge k)$$ is governed by the Poisson count of vertices of degree $$<k$$.
{: .key}

## 6. The giant component

Now the most famous result. Set $$p=c/n$$, so average degree is $$c$$, and let $$C_1, C_2$$ be the largest and second-largest components.

> **Theorem 7 (Erdős–Rényi 1960; refined by many).** Let $$p=c/n$$ with $$c>0$$ fixed, and define $$I_c=c-1-\log c$$.
>
> 1. **Subcritical** ($$c<1$$): $$\lvert C_1\rvert\le\frac{3}{(1-c)^2}\log n$$ whp. More precisely $$\lvert C_1\rvert/\log n\to 1/I_c$$ in probability.
> 2. **Supercritical** ($$c>1$$): $$\lvert C_1\rvert/n\to\zeta_c$$ in probability, where $$\zeta_c\in(0,1)$$ is the unique positive solution of
>
> $$
> 1-\zeta=e^{-c\zeta},
> $$
>
>    and $$\lvert C_2\rvert=O(\log n)$$ whp.
> 3. **Critical** ($$c=1$$): $$\lvert C_1\rvert$$ is of order $$n^{2/3}$$ (bounded away from $$0$$ and $$\infty$$ after dividing by $$n^{2/3}$$, in probability).
{: .theorem}

The function $$\zeta_c$$ is the survival probability of a Poisson($$c$$) Galton–Watson tree, and that is the whole intuition: by local tree-likeness, exploring the component of a vertex looks like growing such a tree; "the tree survives forever" in the limit becomes "the component is giant" in the finite graph.

### Branching-process facts

> **Lemma 8.** Let a Galton–Watson process have offspring distribution $$\xi$$ with generating function $$\varphi(s)=\mathbb E s^\xi$$ and mean $$\mu=\mathbb E\xi$$, with $$\Pr(\xi=1)<1$$. The extinction probability $$q$$ is the smallest root of $$s=\varphi(s)$$ in $$[0,1]$$, and $$q<1$$ if and only if $$\mu>1$$.
{: .theorem}

> **Proof.** Let $$q_k$$ be the probability of extinction by generation $$k$$. Conditioning on the first generation, $$q_{k+1}=\varphi(q_k)$$, with $$q_0=0$$. The sequence increases to $$q$$, so $$q=\varphi(q)$$ by continuity, and induction shows $$q_k\le s^*$$ for any fixed point $$s^*$$, so $$q$$ is the smallest. Since $$\varphi$$ is convex with $$\varphi(1)=1$$ and $$\varphi'(1)=\mu$$, the graph of $$\varphi$$ crosses the diagonal below $$1$$ exactly when $$\mu>1$$.
{: .proof}

For Poisson($$c$$) offspring, $$\varphi(s)=e^{c(s-1)}$$, so the survival probability $$\zeta=1-q$$ solves $$1-\zeta=e^{-c\zeta}$$. Expanding near $$c=1$$ gives $$\zeta_c\approx 2(c-1)$$: the giant is born continuously, with linear growth. For large $$c$$, $$1-\zeta_c\approx e^{-c}$$, which is just the probability of being isolated.

### The exploration process

To make the analogy rigorous, explore the component of a vertex $$v$$ one vertex at a time. Each vertex is *active*, *explored*, or *neutral*. Initially $$v$$ is active and all others are neutral. At step $$t$$, pick an active vertex $$w$$, reveal all pairs between $$w$$ and the current neutral vertices, make the neutral neighbours of $$w$$ active, and mark $$w$$ explored. Let $$A_t$$ be the number of active vertices after step $$t$$. Then

$$
A_0=1,\qquad A_t=A_{t-1}-1+\eta_t,\qquad \eta_t\,\big|\,\text{past}\sim\mathrm{Bin}\big(n-(t-1)-A_{t-1},\,p\big),
$$

and the component size is the first time the walk hits zero, $$\lvert C(v)\rvert=\min\{t:A_t=0\}$$. Each pair is revealed at most once, which is why the conditional distribution is exactly binomial. The walk has increments $$\eta_t-1$$ with mean $$\approx c-1$$ while few vertices have been used: negative drift for $$c<1$$, positive for $$c>1$$. **The phase transition is the sign change of the drift of a random walk.**

> **Proof of part 1 ($$c<1$$).** If $$\lvert C(v)\rvert>k$$ then $$A_k\ge1$$, i.e. $$\sum_{t\le k}\eta_t\ge k$$. Padding the neutral set with dummy vertices couples $$\eta_t\le\eta'_t$$ with $$\eta'_t$$ i.i.d. $$\mathrm{Bin}(n,p)$$, so $$\sum_{t\le k}\eta_t$$ is stochastically dominated by $$\mathrm{Bin}(kn,c/n)$$, with mean $$kc$$. The Chernoff bound with $$1+\delta=1/c$$ gives
>
> $$
> \Pr\big(\lvert C(v)\rvert>k\big)\le\exp\!\Big(-\frac{\delta^2 kc}{2+\delta}\Big)=\exp\!\Big(-\frac{k(1-c)^2}{1+c}\Big)\le e^{-k(1-c)^2/2}.
> $$
>
> Take $$k=\lceil 3\log n/(1-c)^2\rceil$$: the bound is $$n^{-3/2}$$, and a union bound over the $$n$$ starting vertices gives $$\Pr(\lvert C_1\rvert>k)\le n^{-1/2}\to0$$.
{: .proof}

The sharp constant $$1/I_c$$ comes from the exact large-deviation rate: the probability that a Poisson($$c$$) tree has total size $$k$$ decays like $$e^{-I_ck}$$, and the largest of $$n$$ roughly independent trials sits where $$ne^{-I_ck}\approx1$$.

> **Proof sketch of part 2 ($$c>1$$).** Let $$k_-=K\log n$$ for a large constant $$K$$ and $$k_+=n^{2/3}$$.
>
> *(i) Lower coupling.* While at most $$2k_+$$ vertices are non-neutral, $$\eta_t$$ stochastically dominates $$\mathrm{Bin}(n-2k_+,c/n)$$, whose mean $$c'=c(1-o(1))$$ exceeds $$1$$.
>
> *(ii) No mid-sized components.* For $$k_-\le t\le k_+$$, the walk can be at $$0$$ at time $$t$$ only if $$\sum_{s\le t}\eta_s\le t-1$$. By the lower Chernoff bound this has probability at most $$\exp(-t(c'-1)^2/2c')$$. Summing over $$t\ge k_-$$ gives $$O(n^{-2})$$ for $$K$$ large, and a union bound over $$v$$ shows: whp every vertex is either in a component of size $$<K\log n$$ (call it *small*) or its exploration reaches time $$k_+$$ with at least $$\tfrac{c'-1}{2}k_+$$ active vertices (call it *large*).
>
> *(iii) All large vertices share one component.* Take two large vertices whose explorations have not met. Each has a set of at least $$\delta n^{2/3}$$ active vertices, and the pairs between the two sets have not been revealed. The probability that none of these $$\delta^2n^{4/3}$$ pairs is an edge is at most $$(1-c/n)^{\delta^2n^{4/3}}\le\exp(-c\delta^2n^{1/3})$$, small enough to survive a union bound over all $$n^2$$ pairs of vertices.
>
> *(iv) Counting.* For $$O(\log n)$$ steps the exploration can be coupled with a Poisson($$c$$) Galton–Watson tree with error $$o(1)$$, so $$\Pr(v\text{ small})\to q=1-\zeta_c$$. Two vertices' smallness events are asymptotically independent (exploring a small component removes only $$O(\log n)$$ vertices), so the number $$Z$$ of vertices in small components satisfies $$Z/n\to1-\zeta_c$$ by Chebyshev. The remaining $$n-Z$$ vertices are large and form one component: $$\lvert C_1\rvert/n\to\zeta_c$$. All other components are small, so $$\lvert C_2\rvert=O(\log n)$$.
{: .proof}

Steps (ii) and (iii) together are the **no-middle-ground** phenomenon: component sizes are either $$O(\log n)$$ or $$\Theta(n)$$, never in between, and there is room for only one giant because two linear-size sets would be joined by some of their $$\Theta(n^2)\cdot p=\Theta(n)$$ expected cross edges.

### Duality and the shape of the giant

Delete the giant from a supercritical graph. What remains is distributed approximately as a *subcritical* Erdős–Rényi graph on $$(1-\zeta_c)n$$ vertices with average degree

$$
c^*=c(1-\zeta_c)<1,\qquad\text{the unique } c^*<1 \text{ with } c^*e^{-c^*}=ce^{-c}.
$$

This **discrete duality principle** explains why the second-largest component has the same $$\Theta(\log n)$$ order as the largest subcritical component; one can check $$I_{c^*}=I_c$$, and indeed $$\lvert C_2\rvert/\log n\to1/I_c$$ for $$c>1$$. (Convergence is slow; there are $$\log\log n$$ corrections, so finite-$$n$$ simulations sit noticeably below $$\log n/I_c$$.)

<div class="chart">
<script type="application/vnd.vegalite+json">
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "vconcat": [
    {
      "height": 220,
      "layer": [
        {
          "data": {"values": [{"c":0.0,"z":0.0},{"c":0.5,"z":0.0},{"c":1.0,"z":0.0},{"c":1.05,"z":0.0937},{"c":1.1,"z":0.1761},{"c":1.15,"z":0.249},{"c":1.2,"z":0.3137},{"c":1.25,"z":0.3714},{"c":1.3,"z":0.423},{"c":1.35,"z":0.4693},{"c":1.4,"z":0.511},{"c":1.45,"z":0.5487},{"c":1.5,"z":0.5828},{"c":1.6,"z":0.642},{"c":1.7,"z":0.6912},{"c":1.8,"z":0.7324},{"c":1.9,"z":0.7672},{"c":2.0,"z":0.7968},{"c":2.2,"z":0.8437},{"c":2.4,"z":0.8786},{"c":2.6,"z":0.9049},{"c":2.8,"z":0.925},{"c":3.0,"z":0.9405}]},
          "transform": [{"calculate": "'Limit: survival probability of Poisson(c) tree'", "as": "series"}],
          "mark": {"type": "line", "strokeWidth": 2},
          "encoding": {
            "x": {"field": "c", "type": "quantitative", "title": "average degree c = np", "scale": {"domain": [0, 3]}},
            "y": {"field": "z", "type": "quantitative", "title": "|C1| / n"},
            "color": {"field": "series", "type": "nominal", "title": null, "legend": {"orient": "top-left"}}
          }
        },
        {
          "data": {"values": [{"c":0.2,"z":0.0004},{"c":0.4,"z":0.0007},{"c":0.6,"z":0.0014},{"c":0.8,"z":0.0042},{"c":1.0,"z":0.0371},{"c":1.2,"z":0.326},{"c":1.4,"z":0.5127},{"c":1.6,"z":0.6414},{"c":1.8,"z":0.7327},{"c":2.0,"z":0.7959},{"c":2.2,"z":0.8436},{"c":2.4,"z":0.8775},{"c":2.6,"z":0.9063},{"c":2.8,"z":0.9243},{"c":3.0,"z":0.9418}]},
          "transform": [{"calculate": "'Simulated, n = 20,000 (mean of 4)'", "as": "series"}],
          "mark": {"type": "point", "filled": true, "size": 55},
          "encoding": {
            "x": {"field": "c", "type": "quantitative"},
            "y": {"field": "z", "type": "quantitative"},
            "color": {"field": "series", "type": "nominal", "title": null},
            "tooltip": [{"field": "c", "type": "quantitative"}, {"field": "z", "type": "quantitative", "title": "|C1|/n", "format": ".4f"}]
          }
        }
      ]
    },
    {
      "height": 160,
      "data": {"values": [{"c":0.2,"s":6.5},{"c":0.4,"s":12.0},{"c":0.6,"s":23.8},{"c":0.8,"s":66.2},{"c":1.0,"s":280.5},{"c":1.2,"s":84.5},{"c":1.4,"s":35.2},{"c":1.6,"s":23.0},{"c":1.8,"s":16.8},{"c":2.0,"s":11.2},{"c":2.2,"s":8.2},{"c":2.4,"s":7.5},{"c":2.6,"s":5.2},{"c":2.8,"s":5.7},{"c":3.0,"s":4.0}]},
      "mark": {"type": "line", "point": true, "strokeWidth": 2},
      "encoding": {
        "x": {"field": "c", "type": "quantitative", "title": "average degree c = np", "scale": {"domain": [0, 3]}},
        "y": {"field": "s", "type": "quantitative", "title": "|C2| (vertices)"},
        "tooltip": [{"field": "c", "type": "quantitative"}, {"field": "s", "type": "quantitative", "title": "|C2|"}]
      }
    }
  ]
}
</script>
<p class="chart-caption">Top: the giant component fraction against its limit ζ_c. The simulated value at c = 1 is 0.037 rather than 0, because at criticality |C1| ≈ n^(2/3), and n^(2/3)/n ≈ 0.04 at n = 20,000. Bottom: the second-largest component peaks sharply at c = 1. Away from criticality, both sides are logarithmic.</p>
</div>

### Inside the critical window

Why $$n^{2/3}$$? At $$p=1/n$$ the increment $$\eta_t-1$$ has mean $$\approx -t/n$$ (the neutral pool shrinks) and variance $$\approx1$$. After $$t$$ steps the walk has accumulated drift $$-t^2/2n$$ and fluctuations of order $$\sqrt t$$. These balance when $$t^2/n\asymp\sqrt t$$, i.e. $$t\asymp n^{2/3}$$, and the walk height is then of order $$n^{1/3}$$. With $$p=(1+\lambda n^{-1/3})/n$$ and time rescaled by $$n^{2/3}$$,

$$
n^{-1/3}A_{\lfloor sn^{2/3}\rfloor}\;\Rightarrow\;W(s)+\lambda s-\tfrac{s^2}{2},
$$

a Brownian motion with parabolic drift. Aldous (1997) showed that the sizes of the largest components, divided by $$n^{2/3}$$, converge to the ordered lengths of excursions of this process above its running minimum. As $$\lambda$$ goes from $$-\infty$$ to $$+\infty$$, these components merge (the *multiplicative coalescent*) until one of them dominates and becomes the giant. The "double jump" Erdős and Rényi observed at $$m=n/2$$ edges is this window seen from outside: $$O(\log n)$$, then $$n^{2/3}$$, then $$\Theta(n)$$.

Components with more than one cycle (*complex components*) appear only from the critical window on. In the subcritical regime, whp every component is a tree or has exactly one cycle, which is consistent with the cycle counts of Section 2.

### Explore it

The figure draws $$G(n,c/n)$$ with $$n=300$$ using the standard coupling, so increasing $$c$$ only adds edges. The largest component is in the topic colour.

<div class="chart widget" data-no-annotate="">
<div class="widget-row">
<label for="er-c">Average degree \(c = np\): <strong id="er-cval">1.00</strong></label>
<input type="range" id="er-c" min="0" max="4" step="0.05" value="1">
<button id="er-new" type="button" class="btn btn--ghost">New graph</button>
</div>
<canvas id="er-cv" style="height:420px" role="img" aria-label="A drawing of a random graph on 300 vertices, with its largest component highlighted"></canvas>
<output id="er-out" aria-live="polite"></output>
<p class="chart-caption">Move c slowly through 1. Below 1, everything is small trees (the excess, edges minus vertices plus components, counts independent cycles and stays near zero). Just above 1 one component absorbs its neighbours; past c ≈ log 300 ≈ 5.7 the graph would be connected. At n = 300 the transition is blurred over the window c = 1 ± O(n^(−1/3)) ≈ 1 ± 0.15.</p>
</div>

<script>
(function () {
  var n = 300, CMAX = 4.5;
  var cv = document.getElementById('er-cv'), ctx = cv.getContext('2d');
  var cIn = document.getElementById('er-c'), cOut = document.getElementById('er-cval');
  var out = document.getElementById('er-out');
  var article = document.querySelector('article.article') || document.documentElement;
  var pairs = [], X = new Float64Array(n), Y = new Float64Array(n), DX = new Float64Array(n), DY = new Float64Array(n);
  var edges = [], comp = new Int32Array(n), big = -1, heat = 0, raf = null;

  function newGraph() {
    pairs = [];
    var thr = CMAX / n;
    for (var i = 0; i < n; i++) for (var j = i + 1; j < n; j++) {
      var u = Math.random();
      if (u < thr) pairs.push([u, i, j]);
    }
    pairs.sort(function (a, b) { return a[0] - b[0]; });
    for (var k = 0; k < n; k++) { X[k] = Math.random(); Y[k] = Math.random(); }
  }

  function zeta(c) {
    if (c <= 1) return 0;
    var z = 1; for (var i = 0; i < 500; i++) z = 1 - Math.exp(-c * z); return z;
  }

  function update() {
    var c = parseFloat(cIn.value), p = c / n;
    cOut.textContent = c.toFixed(2);
    edges = [];
    for (var k = 0; k < pairs.length && pairs[k][0] < p; k++) edges.push(pairs[k]);
    var par = new Int32Array(n);
    for (var i = 0; i < n; i++) par[i] = i;
    function find(a) { while (par[a] !== a) { par[a] = par[par[a]]; a = par[a]; } return a; }
    edges.forEach(function (e) { var a = find(e[1]), b = find(e[2]); if (a !== b) par[a] = b; });
    var size = {}, ncomp = 0, iso = 0;
    for (i = 0; i < n; i++) { comp[i] = find(i); size[comp[i]] = (size[comp[i]] || 0) + 1; }
    var sizes = [];
    for (var r in size) { ncomp++; sizes.push([size[r], +r]); if (size[r] === 1) iso++; }
    sizes.sort(function (a, b) { return b[0] - a[0]; });
    big = sizes[0][1];
    var s2 = sizes.length > 1 ? sizes[1][0] : 0;
    out.textContent = 'n = ' + n + ', m = ' + edges.length + ' edges. Largest component ' + sizes[0][0] +
      ' (limit ζ·n ≈ ' + Math.round(zeta(c) * n) + '), second ' + s2 + ', isolated vertices ' + iso +
      ', excess (cycles) ' + (edges.length - n + ncomp) + '.';
    heat = 1; if (!raf) raf = requestAnimationFrame(step);
  }

  function relax() {
    var k = Math.sqrt(1 / n) * 0.9, k2 = k * k, i, j;
    for (i = 0; i < n; i++) { DX[i] = 0; DY[i] = 0; }
    for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) {
      var dx = X[i] - X[j], dy = Y[i] - Y[j], d2 = dx * dx + dy * dy + 1e-6;
      if (d2 > 0.04) continue;
      var f = k2 / d2;
      DX[i] += dx * f; DY[i] += dy * f; DX[j] -= dx * f; DY[j] -= dy * f;
    }
    edges.forEach(function (e) {
      var a = e[1], b = e[2], dx = X[a] - X[b], dy = Y[a] - Y[b], d = Math.sqrt(dx * dx + dy * dy) + 1e-9;
      var f = d / k;
      DX[a] -= dx * f; DY[a] -= dy * f; DX[b] += dx * f; DY[b] += dy * f;
    });
    var t = 0.03 * heat + 0.002;
    for (i = 0; i < n; i++) {
      DX[i] += (0.5 - X[i]) * 0.8; DY[i] += (0.5 - Y[i]) * 0.8;
      var L = Math.sqrt(DX[i] * DX[i] + DY[i] * DY[i]) + 1e-9, s = Math.min(L, t) / L;
      X[i] = Math.min(0.99, Math.max(0.01, X[i] + DX[i] * s));
      Y[i] = Math.min(0.99, Math.max(0.01, Y[i] + DY[i] * s));
    }
  }

  function css(el, name) { return getComputedStyle(el).getPropertyValue(name).trim(); }

  function draw() {
    var root = document.documentElement, dpr = window.devicePixelRatio || 1;
    var w = cv.clientWidth, h = cv.clientHeight;
    if (!w) return;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    var muted = css(root, '--muted'), grid = css(root, '--border');
    var topic = css(article, '--topic') || css(root, '--accent');
    var side = Math.min(w, h), ox = (w - side) / 2, oy = (h - side) / 2;
    function px(i) { return ox + X[i] * side; } function py(i) { return oy + Y[i] * side; }
    ctx.lineWidth = 1;
    edges.forEach(function (e) {
      ctx.strokeStyle = comp[e[1]] === big ? topic : grid;
      ctx.globalAlpha = comp[e[1]] === big ? 0.7 : 1;
      ctx.beginPath(); ctx.moveTo(px(e[1]), py(e[1])); ctx.lineTo(px(e[2]), py(e[2])); ctx.stroke();
    });
    ctx.globalAlpha = 1;
    for (var i = 0; i < n; i++) {
      ctx.fillStyle = comp[i] === big ? topic : muted;
      ctx.beginPath(); ctx.arc(px(i), py(i), comp[i] === big ? 3.2 : 2.4, 0, 2 * Math.PI); ctx.fill();
    }
  }

  function step() {
    relax(); relax();
    heat *= 0.97;
    draw();
    raf = heat > 0.02 ? requestAnimationFrame(step) : null;
  }

  cIn.addEventListener('input', update);
  document.getElementById('er-new').addEventListener('click', function () { newGraph(); update(); });
  window.addEventListener('resize', draw);
  document.addEventListener('rr:themechange', draw);
  newGraph(); update();
})();
</script>

### Distances: a small world

In the supercritical regime, how far apart are two vertices of the giant? The ball of radius $$r$$ around a vertex has about $$c^r$$ vertices while it is still tree-like. Two balls of size about $$\sqrt n$$ intersect with constant probability (birthday paradox), so typical distances are about $$2\cdot\tfrac12\log_c n$$:

$$
\mathrm{dist}(u,v)=(1+o(1))\frac{\log n}{\log c}\quad\text{for typical }u,v\in C_1 .
$$

The **diameter** is larger by a constant factor, because of long thin paths ("dangling trees") hanging off the giant. Riordan and Wormald (2010) showed $$\mathrm{diam}=\frac{\log n}{\log c}+\frac{2\log n}{\log(1/c^*)}+O_p(1)$$, with $$c^*$$ the dual parameter above.

In the dense regime ($$p$$ constant), the diameter is $$2$$: a fixed non-adjacent pair has no common neighbour with probability $$(1-p^2)^{n-2}$$, and $$n^2(1-p^2)^{n-2}\to0$$. The same calculation gives the threshold for diameter $$2$$ at $$p\approx\sqrt{2\log n/n}$$, where $$n^2e^{-np^2}$$ crosses $$1$$.

## 7. The dense regime: cliques, independent sets, colouring

Now fix $$p\in(0,1)$$. Every vertex has degree about $$pn$$, every pair has about $$p^2n$$ common neighbours, and the graph looks very homogeneous. The interesting questions are about extremal substructures.

### The clique number is $$2\log_{1/p}n$$, almost deterministically

> **Theorem 9 (Matula 1976; Grimmett–McDiarmid 1975; Bollobás–Erdős 1976).** Let $$p\in(0,1)$$ be fixed and $$b=1/p$$. Then $$\omega(G(n,p))/(2\log_b n)\to1$$ in probability. Much more is true: there is $$k_0=k_0(n)$$ such that $$\omega(G(n,p))\in\{k_0,k_0+1\}$$ whp (for most $$n$$, it is a single value), with
>
> $$
> k_0= 2\log_b n-2\log_b\log_b n+2\log_b(e/2)+1+o(1).
> $$
{: .theorem}

Let $$X_k$$ be the number of $$k$$-cliques, so $$\mathbb EX_k=\binom nk p^{\binom k2}$$. Using $$\binom nk\approx(en/k)^k$$,

$$
\mathbb EX_k\approx\Big(\frac{en}{k}\,p^{(k-1)/2}\Big)^k .
$$

The bracket crosses $$1$$ at $$k\approx2\log_bn$$, and because it is raised to the power $$k$$, $$\mathbb EX_k$$ falls off a cliff there. For $$n=1000$$, $$p=1/2$$:

| $$k$$ | 13 | 14 | 15 | 16 | 17 |
|---|---:|---:|---:|---:|---:|
| $$\mathbb E X_k$$ | $$4.9\times10^5$$ | $$4{,}230$$ | $$17$$ | $$0.032$$ | $$2.8\times10^{-5}$$ |

Moving $$k$$ by one changes the expectation by a factor of roughly $$n p^{k}\approx n^{-1}$$, so only one or two values of $$k$$ have $$\mathbb E X_k$$ anywhere near $$1$$. Note also that the asymptotic $$2\log_2 1000\approx19.9$$ is far from the actual answer $$15$$ or so; the $$-2\log_b\log_b n$$ correction is large at practical sizes. In 40 samples of $$G(100,1/2)$$ (where $$\mathbb EX_9=27.7$$ and $$\mathbb EX_{10}=0.49$$) the clique number was $$9$$ in 31 cases, $$10$$ in 8 and $$8$$ in 1.

> **Proof of $$\omega/(2\log_bn)\to1$$.** *Upper bound.* Let $$k=\lceil(2+\varepsilon)\log_bn\rceil$$. Then $$p^{(k-1)/2}\le p^{-1/2}n^{-1-\varepsilon/2}$$, so $$\mathbb EX_k\le\big(e\,p^{-1/2}n^{-\varepsilon/2}/k\big)^k\to0$$.
>
> *Lower bound.* Let $$k=\lfloor(2-\varepsilon)\log_bn\rfloor$$. Then $$\mathbb EX_k\ge\big((n/k)p^{(k-1)/2}\big)^k\ge(n^{\varepsilon/2}/k)^k\to\infty$$. For the second moment, two $$k$$-sets sharing $$i$$ vertices are dependent iff $$i\ge2$$, and then the union needs $$2\binom k2-\binom i2$$ edges. So
>
> $$
> \frac{\Delta}{(\mathbb EX_k)^2}=\sum_{i=2}^{k-1}\frac{\binom ki\binom{n-k}{k-i}}{\binom nk}\,b^{\binom i2}.
> $$
>
> The fraction is the hypergeometric probability that a random $$k$$-set meets a fixed one in $$i$$ points, at most $$\binom ki\big(\tfrac{k}{n-k}\big)^i\le\big(\tfrac{2k^2}{n}\big)^i$$. And $$b^{\binom i2}\le\big(b^{k/2}\big)^i\le n^{(1-\varepsilon/2)i}$$. So the $$i$$-th term is at most $$\big(2k^2n^{-\varepsilon/2}\big)^i$$, and the sum over $$i\ge2$$ is $$O(k^4n^{-\varepsilon})\to0$$. (The $$i=k$$ term, $$A=B$$, is not in $$\Delta$$.) Lemma 2 finishes the proof.
{: .proof}

By symmetry the independence number is $$\alpha(G(n,p))\approx2\log_{1/(1-p)}n$$. For $$p=1/2$$, both are about $$2\log_2n$$.

### Erdős's Ramsey bound: where the subject started

The clique calculation is older than random graph theory. In 1947 Erdős used it to show that the Ramsey number $$R(k,k)$$, the least $$n$$ such that every graph on $$n$$ vertices has a clique or an independent set of size $$k$$, grows exponentially.

> **Theorem 10 (Erdős 1947).** $$R(k,k)>2^{k/2}$$ for $$k\ge3$$.
{: .theorem}

> **Proof.** Let $$n=\lfloor2^{k/2}\rfloor$$ and $$G=G(n,1/2)$$. The expected number of $$k$$-sets that are cliques or independent sets is
>
> $$
> 2\binom nk2^{-\binom k2}<\frac{2n^k}{k!}2^{-k(k-1)/2}\le\frac{2\cdot2^{k^2/2}}{k!}\,2^{-k^2/2+k/2}=\frac{2^{1+k/2}}{k!}<1 .
> $$
>
> So some graph on $$n$$ vertices has neither.
{: .proof}

Eighty years later, no explicit construction comes close to random graphs here: a random graph is, in this sense, more "disordered" than anything we know how to write down. The upper bound $$R(k,k)\le4^k$$ stood (up to lower-order factors) until Campos, Griffiths, Morris and Sahasrabudhe improved the base to $$4-\varepsilon$$ in 2023; the lower bound $$\sqrt2^{\,k}$$ is still essentially Erdős's.

### Chromatic number

Since every colour class is an independent set, $$\chi\ge n/\alpha$$, so $$\chi(G(n,p))\ge(1-o(1))\,n/(2\log_bn)$$ with $$b=1/(1-p)$$. Bollobás (1988) proved this is tight, $$\chi(G(n,p))=(1+o(1))\,n/(2\log_bn)$$; the difficulty is to show that independent sets of size close to $$2\log_bn$$ can be found in *every* large subset of vertices, which needs Janson's inequality instead of Chebyshev because of a union bound over exponentially many subsets.

Concentration, on the other hand, is easy and illustrates the martingale method.

> **Theorem 11 (Shamir–Spencer 1987).** For any $$p=p(n)$$, $$\Pr\big(\lvert\chi(G(n,p))-\mathbb E\chi\rvert\ge\lambda\sqrt n\big)\le2e^{-\lambda^2/2}$$.
{: .theorem}

> **Proof.** Expose the graph vertex by vertex: $$M_i=\mathbb E[\chi\mid\text{edges among }1,\dots,i]$$. This is a martingale from $$M_1=\mathbb E\chi$$ to $$M_n=\chi$$. Changing the edges at one vertex changes $$\chi$$ by at most $$1$$ (give that vertex a new colour), so $$\lvert M_i-M_{i-1}\rvert\le1$$. Azuma–Hoeffding gives the bound with $$n-1$$ steps.
{: .proof}

The proof never uses what $$\chi$$ is, only that it is $$1$$-Lipschitz under vertex changes; the same argument concentrates $$\alpha$$, $$\omega$$, the size of the largest matching, and many other graph parameters. In the sparse regime, concentration is much tighter: $$\chi(G(n,c/n))$$ takes one of two consecutive values whp (Łuczak 1991), and Achlioptas and Naor (2005) identified them as $$k_c$$ or $$k_c+1$$ with $$k_c$$ the smallest integer $$k$$ satisfying $$c<2k\log k$$.

## 8. Logic and the general theory of thresholds

### Zero–one laws

For fixed $$p$$, a striking statement holds about every property expressible in the first-order language of graphs (quantifiers over vertices, adjacency and equality; no quantifying over sets).

> **Theorem 12 (Glebskii et al. 1969; Fagin 1976).** For fixed $$p\in(0,1)$$ and every first-order sentence $$\phi$$, $$\Pr(G(n,p)\models\phi)\to0$$ or $$1$$.
{: .theorem}

The key is the family of **extension axioms**: for all disjoint vertex sets $$A,B$$ with $$\lvert A\rvert+\lvert B\rvert\le r$$, there is a vertex outside $$A\cup B$$ adjacent to everything in $$A$$ and nothing in $$B$$. Each holds whp, by a union bound:

$$
\Pr(\text{some }(A,B)\text{ fails})\le n^{r}\big(1-p^{\lvert A\rvert}(1-p)^{\lvert B\rvert}\big)^{n-r}\to0 .
$$

The set of all extension axioms is a complete theory whose unique countable model is the **Rado graph** (the "random graph" of model theory). So every first-order sentence is either implied by finitely many extension axioms (and holds whp) or its negation is. Connectivity and Hamiltonicity are not first-order, which is why they need the separate arguments of Section 5.

For sparse $$p=n^{-\alpha}$$, Shelah and Spencer (1988) proved a zero–one law when $$\alpha$$ is irrational; at rational $$\alpha$$ it fails, because some subgraph has density exactly $$1/\alpha$$ and appears with a probability strictly between $$0$$ and $$1$$ (as in Proposition 5).

### First moments are almost always right: Kahn–Kalai

Theorem 4 shows that a smart first-moment calculation (over the densest subgraph) gives the subgraph threshold exactly. Section 5 shows a case where the naive first moment is off: the expected number of perfect matchings becomes large at $$p\asymp1/n$$, but the true threshold is $$\log n/n$$, because of isolated vertices (a coupon-collector effect).

Kahn and Kalai conjectured in 2006 that this logarithmic gap is the worst that can happen. Define the **expectation threshold** $$q(\mathcal A)$$ as the largest $$p$$ for which a first-moment argument can certify that $$\mathcal A$$ is unlikely: some family of edge sets $$\mathcal G$$ "covers" $$\mathcal A$$ (every graph in $$\mathcal A$$ contains a member of $$\mathcal G$$) while $$\sum_{S\in\mathcal G}p^{\lvert S\rvert}\le1/2$$. Trivially $$q(\mathcal A)\le p_c(\mathcal A)$$.

> **Theorem 13 (Park–Pham 2022, the Kahn–Kalai conjecture).** There is a universal constant $$K$$ such that for every increasing property $$\mathcal A$$, $$p_c(\mathcal A)\le K\,q(\mathcal A)\log\ell(\mathcal A)$$, where $$\ell(\mathcal A)$$ is the size of the largest minimal element of $$\mathcal A$$.
{: .theorem}

For perfect matchings, Hamilton cycles, or spanning trees of bounded degree, $$\ell\asymp n$$ and $$q\asymp1/n$$, so the theorem gives the right threshold $$\log n/n$$ up to a constant. In practice: **when you see a threshold conjectured in a paper, the first thing to check is the expectation threshold**; the truth lies within a log factor of it.

## 9. What Erdős–Rényi misses, and what papers use instead

Erdős–Rényi is the null model of network science and the base case of almost every random-graph analysis. Its limitations motivate most of the alternatives you will meet:

**Degrees.** Poisson degrees have light tails; real networks often have heavy-tailed degrees. The **configuration model** (a uniform random multigraph with a prescribed degree sequence) and the **Chung–Lu** / **inhomogeneous random graph** models (edge $$ij$$ present with probability $$\approx w_iw_j/\sum_kw_k$$) fix this. The giant component criterion generalises cleanly: with degree distribution $$D$$, there is a giant iff the mean of the *size-biased* excess degree exceeds one (Molloy–Reed 1995),

$$
\frac{\mathbb E[D(D-1)]}{\mathbb E[D]}>1,
$$

which for $$D\sim\mathrm{Poisson}(c)$$ is $$c>1$$. The exploration-process proof of Section 6 carries over, with the branching process now having the size-biased offspring law. This explains why heavy tails make networks robust: if $$\mathbb E[D^2]=\infty$$ the criterion holds no matter how many random vertices you delete.

**Clustering.** In $$G(n,c/n)$$ the probability that two neighbours of a vertex are adjacent is $$p\to0$$; in social networks it is a constant. Random geometric graphs and models with planted triangles address this.

**Communities.** The **stochastic block model** puts vertices into groups and uses edge probability $$a/n$$ within groups and $$b/n$$ between. It is Erdős–Rényi inside each block, and the ideas here (local tree-likeness, branching processes, second moments) drive its theory. For two equal groups, detecting the partition better than chance is possible iff $$(a-b)^2>2(a+b)$$ (conjectured by Decelle, Krzakala, Moore and Zdeborová, 2011; proved by Mossel–Neeman–Sly and Massoulié). This is the Kesten–Stigum threshold for the corresponding two-type branching process. Exact recovery happens at $$p\asymp\log n/n$$, for the same reason connectivity does.

**Dense limits.** As $$n\to\infty$$, $$G(n,p)$$ with fixed $$p$$ converges to the constant **graphon** $$W\equiv p$$. Graphon models $$W(x,y)$$ are the dense generalisation, and $$G(n,p)$$ is the "structureless" graphon against which quasi-randomness is measured.

**Planted problems.** Hide a clique of size $$k$$ in $$G(n,1/2)$$. Since the natural clique number is $$\approx2\log_2n$$, any $$k\ge(2+\varepsilon)\log_2n$$ is statistically detectable, but known polynomial-time algorithms need $$k\gtrsim\sqrt n$$ (spectral methods; Alon–Krivelevich–Sudakov 1998). This **planted clique** gap is a standard source of computational lower bounds in statistics and learning, and Theorem 9 is what defines the statistical side.

## 10. A reading guide

When you open a paper that uses Erdős–Rényi graphs, three questions orient you almost immediately.

**Which regime?** The scale of $$np$$ tells you what structure to expect and which tools will appear.

| Scale | Structure | Typical tools |
|---|---|---|
| $$np\to0$$ | Forest of small trees | First moment, Poisson counts |
| $$np=c$$ (sparse) | Tree-like locally; giant iff $$c>1$$ | Branching processes, exploration walks, belief propagation, cavity method |
| $$np=(1+o(1))$$ | Critical window $$n^{-1/3}$$ | Brownian scaling limits |
| $$np\asymp\log n$$ | Connectivity, matchings, Hamiltonicity, exact recovery | Poisson for low-degree vertices plus union bounds |
| $$np\gg\log n$$ | Nearly regular; spectrum concentrated | Chernoff plus union bounds, matrix concentration |
| $$p$$ constant | Dense, homogeneous | Second moment, Janson, martingales, extension axioms |

**Is the property local or global?** Local properties (containing a fixed subgraph) have coarse thresholds and Poisson limits. Global properties have sharp thresholds, often determined by the disappearance of a local obstruction.

**Which inequality is doing the work?** Nonexistence results are first moment or union bounds. Existence results are second moment (polynomial error), Janson (exponential error, for union bounds over many sets), or an explicit algorithm or exploration. Concentration results are Azuma/Talagrand on an exposure martingale. Distributional limits are factorial moments or Stein–Chen.

Two numbers worth remembering: the average degree $$1$$ for the giant and $$\log n$$ for connectivity. Many thresholds in applied papers are one of these in disguise.

## Summary

- $$G(n,p)$$ includes each edge independently; $$G(n,m)$$ is uniform with $$m$$ edges. They agree for monotone properties when $$m\approx pn^2/2$$. The coupling $$G_p=\{e:U_e\le p\}$$ makes all $$p$$ simultaneous and is the source of monotonicity and hitting-time results.
- Every monotone property has a threshold (Bollobás–Thomason). Local properties like containing $$H$$ have coarse thresholds at $$n^{-1/m(H)}$$ with Poisson counts; global ones are sharp (Friedgut), and by Park–Pham every threshold lies within a log factor of the first-moment prediction.
- At $$p=c/n$$ the graph is locally a Poisson($$c$$) Galton–Watson tree. Components are $$O(\log n)$$ for $$c<1$$, a unique giant of size $$\zeta_cn$$ with $$1-\zeta_c=e^{-c\zeta_c}$$ appears for $$c>1$$, and the critical window $$c=1+O(n^{-1/3})$$ has components of order $$n^{2/3}$$. The proof is a random walk whose drift changes sign at $$c=1$$.
- The graph is connected for $$p=(\log n+c)/n$$ with probability $$e^{-e^{-c}}$$, because isolated vertices are the last obstruction; matchings and Hamilton cycles behave the same way with minimum degree $$1$$ and $$2$$.
- For constant $$p$$, the clique number is concentrated on two values near $$2\log_{1/p}n$$, the chromatic number is $$\sim n/(2\log_{1/(1-p)}n)$$, and every first-order property has probability tending to $$0$$ or $$1$$.
