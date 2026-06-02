import type { Topic } from "./types";

export const STATS_TOPICS: Topic[] = [
  { slug: "histograms-distributions", label: "Histograms & Distributions", description: "Visualizing data shape, spread, and frequency", playlist: "statistics" },
  { slug: "mean-median-mode", label: "Mean, Median & Mode", description: "Measures of central tendency and when to use each", playlist: "statistics" },
  { slug: "variance-standard-deviation", label: "Variance & Std Deviation", description: "Quantifying spread and variability in data", playlist: "statistics" },
  { slug: "normal-distribution", label: "Normal Distribution", description: "The bell curve: properties, z-scores, and applications", playlist: "statistics" },
  { slug: "probability", label: "Probability", description: "Rules, events, independence, and conditional probability", playlist: "statistics" },
  { slug: "hypothesis-testing", label: "Hypothesis Testing", description: "Null hypotheses, test statistics, and decision rules", playlist: "statistics" },
  { slug: "p-values-significance", label: "P-Values & Significance", description: "What p-values mean and common misconceptions", playlist: "statistics" },
  { slug: "confidence-intervals", label: "Confidence Intervals", description: "Interval estimation and what 95% really means", playlist: "statistics" },
  { slug: "t-tests", label: "T-Tests", description: "One-sample, two-sample, and paired t-tests", playlist: "statistics" },
  { slug: "anova", label: "ANOVA", description: "Comparing means across multiple groups", playlist: "statistics" },
  { slug: "linear-regression", label: "Linear Regression", description: "Fitting lines, residuals, R², and assumptions", playlist: "statistics" },
  { slug: "correlation", label: "Correlation", description: "Pearson r, Spearman, and correlation vs causation", playlist: "statistics" },
  { slug: "bayesian-statistics", label: "Bayesian Statistics", description: "Priors, likelihoods, posteriors, and Bayes' theorem", playlist: "statistics" },
  { slug: "central-limit-theorem", label: "Central Limit Theorem", description: "Why sample means become normal and why it matters", playlist: "statistics" },
  { slug: "chi-square-tests", label: "Chi-Square Tests", description: "Goodness of fit and tests of independence", playlist: "statistics" },
  { slug: "logistic-regression", label: "Logistic Regression", description: "Binary outcomes, log-odds, and odds ratios", playlist: "statistics" },
  { slug: "sensitivity-specificity", label: "Sensitivity & Specificity", description: "Diagnostic test performance and ROC curves", playlist: "statistics" },
  { slug: "bootstrapping", label: "Bootstrapping", description: "Resampling methods for estimation and inference", playlist: "statistics" },
  { slug: "multiple-testing", label: "Multiple Testing", description: "Family-wise error, FDR, Bonferroni, and Benjamini-Hochberg", playlist: "statistics" },
  { slug: "covariance-correlation", label: "Covariance & Correlation", description: "Joint variability and standardized relationships", playlist: "statistics" },
];

export const ML_TOPICS: Topic[] = [
  { slug: "decision-trees", label: "Decision Trees", description: "How trees split data, impurity measures, and pruning", playlist: "machine-learning" },
  { slug: "random-forests", label: "Random Forests", description: "Bagging, feature randomness, and ensemble power", playlist: "machine-learning" },
  { slug: "gradient-boosting", label: "Gradient Boosting", description: "Sequential ensembles, pseudo-residuals, and learning rate", playlist: "machine-learning" },
  { slug: "xgboost", label: "XGBoost", description: "Regularization, tree pruning, and why XGBoost dominates tabular data", playlist: "machine-learning" },
  { slug: "support-vector-machines", label: "Support Vector Machines", description: "Margins, kernels, and the max-margin classifier", playlist: "machine-learning" },
  { slug: "neural-networks-basics", label: "Neural Networks Basics", description: "Perceptrons, activation functions, and forward pass", playlist: "machine-learning" },
  { slug: "backpropagation", label: "Backpropagation", description: "Chain rule, gradients, and how networks learn", playlist: "machine-learning" },
  { slug: "pca-dimensionality-reduction", label: "PCA & Dimensionality Reduction", description: "Principal components, variance explained, and scree plots", playlist: "machine-learning" },
  { slug: "clustering-kmeans-hierarchical", label: "Clustering", description: "K-means, hierarchical clustering, and choosing k", playlist: "machine-learning" },
  { slug: "cross-validation", label: "Cross-Validation", description: "k-fold CV, train/val/test splits, and data leakage", playlist: "machine-learning" },
  { slug: "bias-variance-tradeoff", label: "Bias-Variance Tradeoff", description: "Underfitting, overfitting, and the sweet spot", playlist: "machine-learning" },
  { slug: "regularisation-l1-l2", label: "Regularisation (L1 & L2)", description: "Ridge, Lasso, and controlling model complexity", playlist: "machine-learning" },
  { slug: "logistic-regression-ml", label: "Logistic Regression (ML)", description: "Sigmoid, decision boundaries, and gradient descent", playlist: "machine-learning" },
  { slug: "naive-bayes", label: "Naive Bayes", description: "Conditional independence, class priors, and text classification", playlist: "machine-learning" },
  { slug: "k-nearest-neighbours", label: "K-Nearest Neighbours", description: "Distance metrics, choosing k, and lazy learning", playlist: "machine-learning" },
  { slug: "ensemble-methods", label: "Ensemble Methods", description: "Bagging, boosting, stacking, and wisdom of crowds", playlist: "machine-learning" },
  { slug: "loss-functions", label: "Loss Functions", description: "MSE, cross-entropy, hinge loss, and when to use each", playlist: "machine-learning" },
  { slug: "overfitting-underfitting", label: "Overfitting & Underfitting", description: "Learning curves, model capacity, and generalisation", playlist: "machine-learning" },
  { slug: "feature-engineering", label: "Feature Engineering", description: "Encoding, scaling, interaction terms, and selection", playlist: "machine-learning" },
  { slug: "model-evaluation-metrics", label: "Model Evaluation Metrics", description: "Accuracy, precision, recall, F1, AUC-ROC for classification and regression", playlist: "machine-learning" },
  { slug: "linear-regression-ml", label: "Linear Regression (ML)", description: "Least squares, gradient descent framing, and regularisation in regression", playlist: "machine-learning" },
  { slug: "gradient-descent", label: "Gradient Descent", description: "Step size, learning rate, batch vs stochastic, and convergence", playlist: "machine-learning" },
  { slug: "roc-auc", label: "ROC Curves & AUC", description: "Threshold trade-offs, true/false positive rates, and comparing classifiers", playlist: "machine-learning" },
  { slug: "entropy-information-gain", label: "Entropy & Information Gain", description: "Entropy, Gini impurity, and how decision trees choose splits", playlist: "machine-learning" },
  { slug: "odds-log-odds", label: "Odds, Log(Odds) & Odds Ratios", description: "Probability vs odds, log-odds, and their role in logistic regression", playlist: "machine-learning" },
  { slug: "adaboost", label: "AdaBoost", description: "Weighted samples, weak learners, and how boosting builds strong classifiers", playlist: "machine-learning" },
  { slug: "deep-learning-fundamentals", label: "Deep Learning Fundamentals", description: "Layers, activations, batch norm, dropout, and training deep networks", playlist: "machine-learning" },
  { slug: "recurrent-neural-networks", label: "Recurrent Neural Networks", description: "Sequence modelling, hidden state, vanishing gradients, and LSTMs", playlist: "machine-learning" },
  { slug: "attention-transformers", label: "Attention & Transformers", description: "Self-attention, positional encoding, and the transformer architecture", playlist: "machine-learning" },
  { slug: "encoding-categorical-data", label: "Encoding Categorical Data", description: "One-hot, ordinal, target encoding, and handling high-cardinality features", playlist: "machine-learning" },
];

export const TOPICS: Topic[] = [...STATS_TOPICS, ...ML_TOPICS];

export function getTopicLabel(slug: string): string {
  return TOPICS.find((t) => t.slug === slug)?.label ?? slug;
}

export function getTopicsByPlaylist(playlist: "statistics" | "machine-learning"): Topic[] {
  return TOPICS.filter((t) => t.playlist === playlist);
}
