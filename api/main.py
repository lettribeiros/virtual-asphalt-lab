from flask import Flask, jsonify, request, abort, send_file
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman
from flask_caching import Cache
from io import BytesIO

import model_prediction as model

CACHE_TIME = 3600 # Tempo de cache em segundos (1h)

app = Flask(__name__)
CORS(app) # CORS para permitir requisições de qualquer origem (em produção, deve-se mudar para a origem correta)
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per minute", "5 per second"],
    storage_uri="memory://"
) # Limiter para limitar o número de requisições (em produção, deve-se alterar para valores aceitáveis, como 20 por minuto e 1 por segundo)
cache = Cache(app, config={'CACHE_TYPE': 'simple'}) # Cache para armazenar os gráficos
talisman = Talisman(
    app,
    content_security_policy={
        'default-src': '\'self\'',
        'img-src': '*'
    }
) # Talisman para adicionar headers de segurança

# Função para gerar a chave do cache
def make_cache_key():
    return request.url

# Converte a imagem do gráfico para um stream
def image_to_stream(fig):
    image_stream = BytesIO()
    fig.savefig(image_stream, format='png', bbox_inches='tight')
    image_stream.seek(0)

    return image_stream

# Obtém os parâmetros da query para utilizar na função de cálculo
def get_params(args):
    bituminous_matrix = args.get('bituminous_matrix', model.default_bituminous_matrix)
    sieve_3_8 = args.get('sieve_3_8', model.default_sieve_3_8)
    sieve_4 = args.get('sieve_4', model.default_sieve_4)
    sieve_200 = args.get('sieve_200', model.default_sieve_200)
    nominal_maximum_size = args.get('nominal_maximum_size', model.default_nominal_maximum_size)
    binder_content = args.get('binder_content', model.default_binder_content)
    binder_viscosity = args.get('binder_viscosity', model.default_binder_viscosity)
    penetration = args.get('penetration', model.default_penetration)
    softening_point = args.get('softening_point', model.default_softening_point)
    void_volume = args.get('void_volume', model.default_void_volume)

    return {
        'bituminous_matrix': bituminous_matrix,
        'sieve_3_8': float(sieve_3_8),
        'sieve_4': float(sieve_4),
        'sieve_200': float(sieve_200),
        'nominal_maximum_size': float(nominal_maximum_size),
        'binder_content': float(binder_content),
        'binder_viscosity': float(binder_viscosity),
        'penetration': float(penetration),
        'softening_point': float(softening_point),
        'void_volume': float(void_volume)
    }

# Valida os parâmetros
def params_validator(args):
    if args['bituminous_matrix'] not in model.bituminous_matrix_mapping:
        abort(400, 'bituminous_matrix must be one of: {}'.format(model.bituminous_matrix_mapping))

    if args['sieve_3_8'] < 0 or args['sieve_3_8'] > 100:
        abort(400, 'sieve_3_8 must be between 0 and 100')

    if args['sieve_4'] < 0 or args['sieve_4'] > 100:
        abort(400, 'sieve_4 must be between 0 and 100')

    if args['sieve_200'] < 0 or args['sieve_200'] > 100:
        abort(400, 'sieve_200 must be between 0 and 100')

    if args['nominal_maximum_size'] < 0 or args['nominal_maximum_size'] > 100:
        abort(400, 'nominal_maximum_size must be between 0 and 100')

    if args['binder_content'] < 0 or args['binder_content'] > 100:
        abort(400, 'binder_content must be between 0 and 100')

    if args['binder_viscosity'] < 0 or args['binder_viscosity'] > 1000:
        abort(400, 'binder_viscosity must be between 0 and 1000')

    if args['penetration'] < 0 or args['penetration'] > 100:
        abort(400, 'penetration must be between 0 and 100')

    if args['softening_point'] < 0 or args['softening_point'] > 100:
        abort(400, 'softening_point must be between 0 and 100')

    if args['void_volume'] < 0 or args['void_volume'] > 100:
        abort(400, 'void_volume must be between 0 and 100')

# Rotas da API
@app.route('/reduced-frequency', methods=['GET'])
@cache.cached(timeout=CACHE_TIME, key_prefix=make_cache_key)
def reduced_frequency():
    try:
        args = get_params(request.args)

        params_validator(args)

        fig = model.reduced_frequency(args)

        image_stream = image_to_stream(fig)

        return send_file(image_stream, mimetype='image/png')
    except Exception as e:
        return jsonify({ 'message': f"An error occurred: {e}" }), 500

@app.route('/low-frequency', methods=['GET'])
@cache.cached(timeout=CACHE_TIME, key_prefix=make_cache_key)
def low_frequency():
    try:
        args = get_params(request.args)

        fig = model.low_frequency(args)

        image_stream = image_to_stream(fig)

        return send_file(image_stream, mimetype='image/png')
    except Exception as e:
        return jsonify({ 'message': f"An error occurred: {e}" }), 500

@app.route('/intermediate-frequency', methods=['GET'])
@cache.cached(timeout=CACHE_TIME, key_prefix=make_cache_key)
def intermediate_frequency():
    try:
        args = get_params(request.args)

        fig = model.intermediate_frequency(args)

        image_stream = image_to_stream(fig)

        return send_file(image_stream, mimetype='image/png')
    except Exception as e:
        return jsonify({ 'message': f"An error occurred: {e}" }), 500

@app.route('/high-frequency', methods=['GET'])
@cache.cached(timeout=CACHE_TIME, key_prefix=make_cache_key)
def high_frequency():
    try:
        args = get_params(request.args)

        fig = model.high_frequency(args)

        image_stream = image_to_stream(fig)

        return send_file(image_stream, mimetype='image/png')
    except Exception as e:
        return jsonify({ 'message': f"An error occurred: {e}" }), 500

@app.errorhandler(404)
def not_found():
    return jsonify({ 'message': 'Not Found' }), 404

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
