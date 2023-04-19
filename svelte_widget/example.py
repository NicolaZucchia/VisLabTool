#!/usr/bin/env python
# coding: utf-8

# Copyright (c) me.
# Distributed under the terms of the Modified BSD License.

"""
TODO: Add module docstring
"""

from ipywidgets import DOMWidget
from traitlets import Unicode, Int, Dict, List
from ._frontend import module_name, module_version
from .modelProcessing import getPredictions

class ExampleWidget(DOMWidget):
    """TODO: Add docstring here"""

    _model_name = Unicode("ExampleModel").tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode("ExampleView").tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    # widget state that is synced between Python and JavaScript

    df = Dict({}).tag(sync=True)
    predictions = List([[],[]]).tag(sync=True)
    height = Int(0).tag(sync=True)  
    size = Int(0).tag(sync=True)


    def __init__(self, df, model1, model2, height=600, **kwargs):
        super().__init__(**kwargs)

        self.df = df.to_dict(orient='list')
        self.height = height
        self.size = df.shape[0]
        self.model1 = model1
        self.model2 = model2
        self.predictions = getPredictions(self.model1, self.model2, self.df)
