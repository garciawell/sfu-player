import React from 'react';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import ListItem from '@material-ui/core/ListItem';
import { useState } from 'react';


function Class1() {

  const SelectComp = () => {

    return (    
    <Select
      // value={age}
      // onChange={handleChange}
      displayEmpty
      inputProps={{ 'aria-label': 'Without label' }}
    >
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
      <MenuItem value={10}>Ten</MenuItem>
      <MenuItem value={20}>Twenty</MenuItem>
      <MenuItem value={30}>Thirty</MenuItem>
    </Select>
    )
  }


  return <div>
            <h2>Vocabulary</h2>
            <Paper className="paper" elevation={3}>
              <p>Classifique as palavras em: características, membros da família, profissão, lugares e verbos</p>
              <List component="nav" aria-label="main mailbox folders">
                <ListItem>busy
                  <SelectComp />
                </ListItem>
                <ListItem>companies</ListItem>
                <ListItem>home</ListItem>
              </List>
            </Paper>
  </div>;
}

export default Class1;