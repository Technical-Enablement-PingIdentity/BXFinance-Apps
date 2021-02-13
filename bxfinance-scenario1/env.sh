#!/usr/bin/env sh

# Recreate config file
rm -rf ./env-config.js
touch ./env-config.js

# Add assignment 
echo "window._env_ = {" >> ./env-config.js

# Read each line in .env file
# Each line represents key=value pairs
#TODO need to only read lines that start REACT_APP_
while read -r line || test -n "${line}"
do
  # Split env variables by character `=`
  if printf '%s\n' "${line}" | grep -q -e '='
  then
    varname=$(printf '%s\n' "${line}" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "${line}" | sed -e 's/^[^=]*=//')
  fi

  # Read value of current variable if exists as Environment variable
  value=$(printf '%s\n' "${!varname}")
  # Otherwise use value from .env file
  #TODO need to skip lines that are comments
  test -z ${value} && value=${varvalue}
  
  # Append configuration property to JS file
  echo "  $varname: \"$value\"," >> ./env-config.js
done < .env

echo "}" >> ./env-config.js