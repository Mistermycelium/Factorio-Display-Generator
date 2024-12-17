import fs from 'fs'

import { encodePlan, addEntity, createEmptyBlueprint, decodePlan } from '@jensforstmann/factorio-blueprint-tools';

import progressBar from './progressbar.js'

import lily from '@jcubic/lily'

import {fonts} from './fonts.js'

const options = lily(process.argv.slice(2), {boolean: ['b']});

const type = options.type || 'item'
const color = options.color || 'orange'
const item = options.item || 'automation-science-pack'
const font = options.font || fonts[2]

class Condition {
  constructor(item, constant, type) {
    this.first_signal = {type: type, name: item}
    this.constant = constant
    if (constant == 100) {
      this.comparator = '≥'
    } else {
      this.comparator = '≤'
    }
  }
}

class Parameter {
  constructor(item, constant, text, type) {
    this.condition = new Condition(item, constant, type)
    this.icon = {type: type, name: item}
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
      let text = progressBar(i, item, color, font, type);
      let param = new Parameter(item, i, text, type)
      params.push(param)
    };
    this.control_behavior = {
      "parameters" : params
    }
    this.text = progressBar(0, item, color, font, type)
    this.icon = {type:type, name:item}
    this.always_show = true
  }
}

// We guard against bad fonts here. TODO: Guard against bad item IDs and colors
if (!fonts.includes(font)) {
  throw new Error(`Invalid font. Valid fonts are: ${fonts}`);
}


if (options.string) {
  const outplan = JSON.stringify(decodePlan(options.string))
  console.log(outplan)
fs.writeFile('output.json',outplan, { encoding: 'utf8' }, (err) => {
  if (err) throw err;});
}

const plan = createEmptyBlueprint()
plan.blueprint.label = `[color=${color}][${type}=${item}] Display[/color]`;
plan.blueprint.icons = [
  {
    signal: {
      name: "display-panel"
    },
    index: 2
  },
  {
    signal: {
      type: type,
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