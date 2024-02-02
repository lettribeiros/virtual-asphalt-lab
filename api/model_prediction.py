import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit
from sklearn.metrics import r2_score
from scipy import stats

# Criar um mapeamento para associar as opções de texto aos valores numéricos
bituminous_matrix_mapping = {"CAP-30/45": 1, "CAP-50/70": 2}

# Carregue o modelo treinado
model = joblib.load("models/GP_best.pkl")
scaler_x = joblib.load("models/scaler_x.pkl")  # Certifique-se de carregar seu scaler
scaler_y = joblib.load("models/scaler_y.pkl")  # Certifique-se de carregar seu scaler

# Defina os valores padrão
default_bituminous_matrix = "CAP-30/45"
default_sieve_3_8 = 80.8
default_sieve_4 = 54.8
default_sieve_200 = 7.6
default_nominal_maximum_size = 12.5
default_binder_content = 4.6
default_binder_viscosity = 360
default_penetration = 53
default_softening_point = 52
default_void_volume = 3.6

def load_freq_list():
    # Carregue o arquivo freq_list.csv
    freq_df = pd.read_csv("./datasets/freq_list.csv")
    freq_list = freq_df["Frequency"].values.reshape(-1, 1)

    return freq_df, freq_list

# === Curve fitting ==============================
# Função sigmoide
def sigmoid(x, a, b, d, g):
    return a + (b / (1 + (1 / (np.exp(d + g * np.log10(x))))))

def fit_sigmoid(y, x):
    # Ajuste de curva usando a função sigmoide
    params, _ = curve_fit(sigmoid, x, y, bounds=(0.01, 20))
    a_opt, b_opt, d_opt, g_opt = params

    # Calculando o R²
    r2_ajuste = r2_score(y, sigmoid(x, a_opt, b_opt, d_opt, g_opt))

    return a_opt, b_opt, d_opt, g_opt, r2_ajuste

def get_y_pred(args, freq_list):
  # Use os valores de entrada selecionados ou predefinidos para a previsão do modelo
  X_input = np.array(
      [
          [
              np.log10(args['bituminous_matrix'] == "CAP-30/45"),
              np.log10(args['sieve_3_8']),
              np.log10(args['sieve_4']),
              np.log10(args['sieve_200']),
              np.log10(args['nominal_maximum_size']),
              np.log10(args['binder_content']),
              np.log10(args['binder_viscosity']),
              np.log10(args['penetration']),
              np.log10(args['softening_point']),
              np.log10(args['void_volume']),
          ]
      ]
  )

  X_repeated = np.repeat(X_input, freq_list.shape[0], axis=0)
  X_input_freq = np.column_stack((X_repeated, np.log10(freq_list)))

  # Faça a previsão
  y_pred_single, y_std_single = model.predict(X_input_freq, return_std=True)

  # Reshape para garantir que seja um array 2D
  y_pred_single_2d = y_pred_single.reshape(-1, 1)

  # Aplica a transformação inversa
  y_pred_desnorm = scaler_y.inverse_transform(y_pred_single_2d)

  y_std_desnorm = scaler_y.inverse_transform(
      y_std_single.reshape(-1, 1)
  )  # Redimensione para torná-lo bidimensional

  return y_pred_desnorm, y_std_desnorm

def reduced_frequency(args):
  freq_df, freq_list = load_freq_list()

  y_pred_desnorm, y_std_desnorm = get_y_pred(args, freq_list)

  lim_inf = y_pred_desnorm - 1.65 * y_std_desnorm
  lim_inf = np.maximum(lim_inf, 0)  # Define valores negativos como zero

  lim_sup = y_pred_desnorm + 1.65 * y_std_desnorm
  lim_sup = np.maximum(lim_sup, 0)  # Define valores negativos como zero

  # === gambiarra ===================================
  freq_list = freq_df["Frequency"].values.ravel()
  lim_inf = lim_inf.ravel()
  lim_sup = lim_sup.ravel()

  # Curve fitting =================================
  # Mean
  x = freq_list
  y_mean = np.log10(y_pred_desnorm).ravel()
  a_mean, b_mean, d_mean, g_mean, r2_ajuste_mean = fit_sigmoid(y_mean, x)
  # Lim_inf
  y_lim_inf = np.where(lim_inf > 0, np.log10(lim_inf), 0)
  a_inf, b_inf, d_inf, g_inf, r2_ajuste_inf = fit_sigmoid(y_lim_inf, x)
  # Lim_sup
  y_lim_sup = np.where(lim_inf > 0, np.log10(lim_inf), 0)
  a_sup, b_sup, d_sup, g_sup, r2_ajuste_sup = fit_sigmoid(y_lim_sup, x)

  # === Ploting ===================================
  # Plotando a curva sigmoide com os dados e o valor de R²
  fig, ax = plt.subplots(figsize=(13, 9))

  # plt.scatter(x, y_pred_desnorm, label='Data')
  plt.plot(freq_list, y_pred_desnorm, label="Mean")
  plt.plot(freq_list, lim_inf, label="Lower limit", linestyle="--", color="green")
  plt.plot(
      freq_list, lim_sup, label="Upper limit", linestyle="--", color="lightgreen"
  )
  plt.fill_between(
      freq_list, lim_inf, lim_sup, alpha=0.5, label="Uncertainty", color="#FFC0CB"
  )
  plt.xlabel("Reduced Frequency (Hz)", fontsize=16)
  plt.ylabel("log |E*| (MPa)", fontsize=16)
  plt.legend(loc="best", fontsize=16)
  plt.xscale("log")
  plt.grid(True)

  # Adicione os coeficientes na lateral direita do gráfico
  coef_text_mean = f"a_mean: {a_mean:.2f}\nb_mean: {b_mean:.2f}\nd_mean: {d_mean:.2f}\ng_mean: {g_mean:.2f}\nR²: {r2_ajuste_mean:.2f}"
  coef_text_inf = f"a_lower: {a_inf:.2f}\nb_lower: {b_inf:.2f}\nd_lower: {d_inf:.2f}\ng_lower: {g_inf:.2f}\nR²: {r2_ajuste_inf:.2f}"
  coef_text_sup = f"a_upper: {a_sup:.2f}\nb_upper: {b_sup:.2f}\nd_upper: {d_sup:.2f}\ng_upper: {g_sup:.2f}\nR²: {r2_ajuste_sup:.2f}"
  ax.text(
      1.03, 0.80, coef_text_mean, transform=ax.transAxes, fontsize=16, va="center"
  )
  ax.text(1.03, 0.50, coef_text_inf, transform=ax.transAxes, fontsize=16, va="center")
  ax.text(1.03, 0.20, coef_text_sup, transform=ax.transAxes, fontsize=16, va="center")

  return fig

def low_frequency(args):
  freq_df, freq_list = load_freq_list()

  y_pred_desnorm, y_std_desnorm = get_y_pred(args, freq_list)

  # Frequencies you want to create Gaussian distributions for
  target_frequencies = [0.124, 0.0124]

  # Create a figure with two subplots side by side
  fig, axes = plt.subplots(1, 2, figsize=(12, 5))

  for idx, target_frequency in enumerate(target_frequencies):
      # Find the index corresponding to the desired frequency
      index = np.argmin(np.abs(freq_list - target_frequency))

      # Mean and standard deviation based on the desired frequency
      mean_value = np.mean(y_pred_desnorm[index])
      std_value = np.mean(y_std_desnorm[index])

      # Create a dataset 'x' for the plot
      x = np.linspace(mean_value - 3 * std_value, mean_value + 3 * std_value, 100)

      # Create the Gaussian distribution
      gaussian_distribution = stats.norm.pdf(x, mean_value, std_value)

      # Lower and upper limits
      lim_inf_value = y_pred_desnorm[index] - 1.65 * y_std_desnorm[index]
      lim_sup_value = y_pred_desnorm[index] + 1.65 * y_std_desnorm[index]

      # Plot the Gaussian distribution on the respective subplot
      ax = axes[idx]
      ax.plot(x, gaussian_distribution, "r-")
      ax.fill_between(
          x,
          gaussian_distribution,
          where=(x > lim_inf_value) & (x < lim_sup_value),
          color="#FFC0CB",
          alpha=0.5,
      )

      # Add mean and standard deviation values to the plot
      ax.annotate(
          f"Mean: {mean_value:.2f}", xy=(mean_value, 0.1), fontsize=12, color="blue"
      )
      ax.annotate(
          f"Standard Deviation: {std_value:.2f}",
          xy=(mean_value, 0.08),
          fontsize=12,
          color="blue",
      )

      # Add horizontal lines at the limits
      # Arredonde os valores para números inteiros
      rounded_lim_inf = round(lim_inf_value[0])
      rounded_lim_sup = round(lim_sup_value[0])

      # Crie as strings da legenda
      leg1 = str(rounded_lim_inf) + " MPa"
      leg2 = str(rounded_lim_sup) + " MPa"

      ax.axvline(x=lim_inf_value, color="green", linestyle="--", label=leg1)
      ax.axvline(x=lim_sup_value, color="lightgreen", linestyle="--", label=leg2)

      ax.set_xlabel("Values")
      ax.set_ylabel("Probability Density")
      ax.set_title(
          "Gaussian Distribution for Frequency: {:.4f} Hz".format(target_frequency)
      )
      ax.grid(True)

      # Create a legend for this subplot
      ax.legend(loc="best")

  return fig

def intermediate_frequency(args):
  freq_df, freq_list = load_freq_list()

  y_pred_desnorm, y_std_desnorm = get_y_pred(args, freq_list)

  # Frequencies you want to create Gaussian distributions for
  target_frequencies = [5, 10]

  # Create a figure with two subplots side by side
  fig, axes = plt.subplots(1, 2, figsize=(12, 5))

  for idx, target_frequency in enumerate(target_frequencies):
      # Find the index corresponding to the desired frequency
      index = np.argmin(np.abs(freq_list - target_frequency))

      # Mean and standard deviation based on the desired frequency
      mean_value = np.mean(y_pred_desnorm[index])
      std_value = np.mean(y_std_desnorm[index])

      # Create a dataset 'x' for the plot
      x = np.linspace(mean_value - 3 * std_value, mean_value + 3 * std_value, 100)

      # Create the Gaussian distribution
      gaussian_distribution = stats.norm.pdf(x, mean_value, std_value)

      # Lower and upper limits
      lim_inf_value = y_pred_desnorm[index] - 1.65 * y_std_desnorm[index]
      lim_sup_value = y_pred_desnorm[index] + 1.65 * y_std_desnorm[index]

      # Plot the Gaussian distribution on the respective subplot
      ax = axes[idx]
      ax.plot(x, gaussian_distribution, "r-")
      ax.fill_between(
          x,
          gaussian_distribution,
          where=(x > lim_inf_value) & (x < lim_sup_value),
          color="#FFC0CB",
          alpha=0.5,
      )

      # Add mean and standard deviation values to the plot
      ax.annotate(
          f"Mean: {mean_value:.2f}", xy=(mean_value, 0.1), fontsize=12, color="blue"
      )
      ax.annotate(
          f"Standard Deviation: {std_value:.2f}",
          xy=(mean_value, 0.08),
          fontsize=12,
          color="blue",
      )

      # Add horizontal lines at the limits
      # Arredonde os valores para números inteiros
      rounded_lim_inf = round(lim_inf_value[0])
      rounded_lim_sup = round(lim_sup_value[0])

      # Crie as strings da legenda
      leg1 = str(rounded_lim_inf) + " MPa"
      leg2 = str(rounded_lim_sup) + " MPa"

      ax.axvline(x=lim_inf_value, color="green", linestyle="--", label=leg1)
      ax.axvline(x=lim_sup_value, color="lightgreen", linestyle="--", label=leg2)

      ax.set_xlabel("Values")
      ax.set_ylabel("Probability Density")
      ax.set_title(
          "Gaussian Distribution for Frequency: {:.4f} Hz".format(target_frequency)
      )
      ax.grid(True)

      # Create a legend for this subplot
      ax.legend(loc="best")

  return fig

def high_frequency(args):
  freq_df, freq_list = load_freq_list()

  y_pred_desnorm, y_std_desnorm = get_y_pred(args, freq_list)

  # Frequencies you want to create Gaussian distributions for
  target_frequencies = [25, 68.4]

  # Create a figure with two subplots side by side
  fig, axes = plt.subplots(1, 2, figsize=(12, 5))

  for idx, target_frequency in enumerate(target_frequencies):
      # Find the index corresponding to the desired frequency
      index = np.argmin(np.abs(freq_list - target_frequency))

      # Mean and standard deviation based on the desired frequency
      mean_value = np.mean(y_pred_desnorm[index])
      std_value = np.mean(y_std_desnorm[index])

      # Create a dataset 'x' for the plot
      x = np.linspace(mean_value - 3 * std_value, mean_value + 3 * std_value, 100)

      # Create the Gaussian distribution
      gaussian_distribution = stats.norm.pdf(x, mean_value, std_value)

      # Lower and upper limits
      lim_inf_value = y_pred_desnorm[index] - 1.65 * y_std_desnorm[index]
      lim_sup_value = y_pred_desnorm[index] + 1.65 * y_std_desnorm[index]

      # Plot the Gaussian distribution on the respective subplot
      ax = axes[idx]
      ax.plot(x, gaussian_distribution, "r-")
      ax.fill_between(
          x,
          gaussian_distribution,
          where=(x > lim_inf_value) & (x < lim_sup_value),
          color="#FFC0CB",
          alpha=0.5,
      )

      # Add mean and standard deviation values to the plot
      ax.annotate(
          f"Mean: {mean_value:.2f}", xy=(mean_value, 0.1), fontsize=12, color="blue"
      )
      ax.annotate(
          f"Standard Deviation: {std_value:.2f}",
          xy=(mean_value, 0.08),
          fontsize=12,
          color="blue",
      )

      # Add horizontal lines at the limits
      # Arredonde os valores para números inteiros
      rounded_lim_inf = round(lim_inf_value[0])
      rounded_lim_sup = round(lim_sup_value[0])

      # Crie as strings da legenda
      leg1 = str(rounded_lim_inf) + " MPa"
      leg2 = str(rounded_lim_sup) + " MPa"

      ax.axvline(x=lim_inf_value, color="green", linestyle="--", label=leg1)
      ax.axvline(x=lim_sup_value, color="lightgreen", linestyle="--", label=leg2)

      ax.set_xlabel("Values")
      ax.set_ylabel("Probability Density")
      ax.set_title(
          "Gaussian Distribution for Frequency: {:.4f} Hz".format(target_frequency)
      )
      ax.grid(True)

      # Create a legend for this subplot
      ax.legend(loc="best")

  return fig

