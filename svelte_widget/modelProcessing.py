def getPredictions(model1, model2, df):
    return [model1(df), model2(df)]