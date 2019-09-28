#!/bin/bash

if [$# -ne 2]; then
    exit 1
fi

inotifywait -rm $1 | tee $2