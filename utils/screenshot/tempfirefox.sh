#!/bin/bash

PROFILEDIR=`mktemp -p /tmp -d tmp-fx-profile.XXXXXX.d`
firefox -profile $PROFILEDIR -no-remote -new-instance --new-tab about:preferences
