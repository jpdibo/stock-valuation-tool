import dash
from dash import dcc, html, Input, Output, State
import plotly.graph_objs as go
import numpy as np

# Example consensus and historical values
CONSENSUS = {
    "Revenue Growth CAGR (%)": 7.5,
    "Operating Margin (%)": 14.2,
    "Discount Rate (%)": 9.8,
    "CAPEX Intensity (%)": 7.9,
    "Working Capital Intensity (%)": 11.5,
    "Tax Rate (%)": 24.5,
    "Terminal Growth Rate (%)": 2.2,
}
HISTORICAL = {
    "Revenue Growth CAGR (%)": 6.2,
    "Operating Margin (%)": 13.1,
    "Discount Rate (%)": 10.5,
    "CAPEX Intensity (%)": 8.2,
    "Working Capital Intensity (%)": 12.0,
    "Tax Rate (%)": 25.0,
    "Terminal Growth Rate (%)": 2.0,
}

DEFAULTS = {
    "Revenue Growth CAGR (%)": 8.0,
    "Operating Margin (%)": 15.0,
    "Discount Rate (%)": 10.0,
    "CAPEX Intensity (%)": 8.0,
    "Working Capital Intensity (%)": 12.0,
    "Tax Rate (%)": 25.0,
    "Terminal Growth Rate (%)": 2.5,
}

YEARS_HIST = 3
YEARS_PROJ = 5

def dcf_projection(start_price, growth, years):
    # Simple compounding for demonstration
    return [start_price * ((1 + growth/100) ** i) for i in range(years+1)]

def make_fan_chart(historical, scenarios, years_proj):
    x_hist = np.arange(len(historical))
    x_proj = np.arange(len(historical)-1, len(historical)+years_proj)
    traces = [
        go.Scatter(
            x=np.concatenate([x_hist, x_proj[1:]]),
            y=np.concatenate([historical, [s['proj'][0]]]),
            mode='lines',
            name='Historical Price',
            line=dict(color='gray', width=3)
        )
    ]
    # Add scenario lines
    for s in scenarios:
        traces.append(
            go.Scatter(
                x=x_proj,
                y=s['proj'],
                mode='lines',
                name=s['name'],
                line=dict(width=2, dash='dash'),
            )
        )
    # Add fan shading
    proj_matrix = np.array([s['proj'] for s in scenarios])
    fan_min = proj_matrix.min(axis=0)
    fan_max = proj_matrix.max(axis=0)
    traces.append(
        go.Scatter(
            x=np.concatenate([x_proj, x_proj[::-1]]),
            y=np.concatenate([fan_max, fan_min[::-1]]),
            fill='toself',
            fillcolor='rgba(0,123,255,0.15)',
            line=dict(color='rgba(0,0,0,0)'),
            hoverinfo='skip',
            name='Projection Range'
        )
    )
    return traces

# Dash app
app = dash.Dash(__name__)
app.layout = html.Div([
    html.H2('DCF Fan Chart Tool'),
    html.Div([
        html.Div([
            html.Label(f"{label}"),
            dcc.Input(
                id=f'input-{label}',
                type='number',
                value=DEFAULTS[label],
                style={'width': '80px'}
            ),
            html.Span(f" (Consensus: {CONSENSUS[label]}, Historical: {HISTORICAL[label]})", style={'fontSize': 12, 'color': '#888'})
        ], style={'marginBottom': 10}) for label in DEFAULTS
    ]),
    html.Button('Update Chart', id='update-btn', n_clicks=0),
    dcc.Graph(id='fan-chart', style={'height': '600px', 'marginTop': 30}),
])

@app.callback(
    Output('fan-chart', 'figure'),
    Input('update-btn', 'n_clicks'),
    [State(f'input-{label}', 'value') for label in DEFAULTS]
)
def update_chart(n_clicks, *inputs):
    # Simulate historical price
    np.random.seed(42)
    hist_price = list(np.cumsum(np.random.normal(0, 0.5, YEARS_HIST*12)) + 30)
    last_hist = hist_price[-1]

    # Scenarios: Bull, Base, Bear
    names = ['Bull', 'Base', 'Bear']
    growths = [
        inputs[0] + 2,  # Bull
        inputs[0],      # Base
        inputs[0] - 2   # Bear
    ]
    scenarios = []
    for name, g in zip(names, growths):
        proj = dcf_projection(last_hist, g, YEARS_PROJ)
        scenarios.append({'name': f'{name} Case', 'proj': proj})

    traces = make_fan_chart(hist_price, scenarios, YEARS_PROJ)
    layout = go.Layout(
        title='Price Projection Fan Chart',
        xaxis=dict(
            title='Date',
            tickvals=[0, 12, 24, 36, 48, 60],
            ticktext=['3y ago', '2y ago', '1y ago', 'Now', '+2y', '+3y'],
            showgrid=True
        ),
        yaxis=dict(title='Price', showgrid=True),
        legend=dict(x=0.01, y=0.99),
        hovermode='x unified'
    )
    return {'data': traces, 'layout': layout}

if __name__ == '__main__':
    app.run(debug=True) 