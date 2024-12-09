import fs from 'fs'

import { encodePlan, addEntity, createEmptyBlueprint } from '@jensforstmann/factorio-blueprint-tools';

import progressBar from './progressbar.js'

import lily from '@jcubic/lily'

import fonts from './fonts.js'

const options = lily(process.argv.slice(2), {boolean: ['b']});


const color = options.color || 'orange'
const item = options.item || 'automation-science-pack'
const font = fonts[2]

class Condition {
  constructor(item, constant) {
    this.first_signal = {name: item}
    this.constant = constant
    if (constant == 100) {
      this.comparator = '≥'
    } else {
      this.comparator = '≤'
    }
  }
}

class Parameter {
  constructor(item, constant, text) {
    this.condition = new Condition(item, constant)
    this.icon = {name: item}
    this.text = text
  }
}

class DisplayPanel {
  constructor(item, position, color) {
    this.name = "display-panel"
    this.position = position
    this.direction = 8
    let params = []
    for (let i = 0; i <= 100; i++) {
      if (i == 49) {continue}
      let text = progressBar(i, item, color, font);
      let param = new Parameter(item, i, text)
      params.push(param)
    };
    this.control_behavior = {
      "parameters" : params
    }
    this.text = progressBar(0,item,color, font)
    this.icon = {name:item}
    this.always_show = true
  }
}

const plan = createEmptyBlueprint()
plan.blueprint.label = `[color=${color}][item=${item}] Display[/color]`;
plan.blueprint.icons = [
  {
    signal: {
      name: "display-panel"
    },
    index: 2
  },
  {
    signal: {
      name: item
    },
    index: 1
  }
]


let displayPanel = new DisplayPanel(item, {
  x: 0,
  y: 0
}, color)
addEntity(plan,displayPanel);

fs.writeFile('output.bpstring',encodePlan(plan), { encoding: 'utf8' }, (err) => {
  if (err) throw err;});