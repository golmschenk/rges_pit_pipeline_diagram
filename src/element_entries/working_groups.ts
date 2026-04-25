export type WorkingGroup = {
    number: number
    name: string
}
export const WorkingGroups = {
    workingGroup1: {number: 1, name: 'Leadership and Project Management'},
    workingGroup2: {number: 2, name: 'Education, Outreach, and Community'},
    workingGroup3: {number: 3, name: 'Event Modeling'},
    workingGroup4: {number: 4, name: 'Lens Flux Analysis'},
    workingGroup5: {number: 5, name: 'Event and Anomaly Detection'},
    workingGroup6: {number: 6, name: 'Variable Stars'},
    workingGroup7: {number: 7, name: 'Survey Simulations and Pipeline Validation'},
    workingGroup8: {number: 8, name: 'Contemporaneous and Precursor Observations'},
    workingGroup9: {number: 9, name: 'Data Challenges, Outreach, and Citizen Science'},
    workingGroup10: {number: 10, name: 'Microlensing Mini-Courses'},
    workingGroup11: {number: 11, name: 'Free Floating Planets'},
    workingGroup12: {number: 12, name: 'Efficiency and Occurrence Rate Analysis'},
    workingGroup13: {number: 13, name: 'Astrometry'},
    workingGroup14: {number: 14, name: 'Global Pipeline'},
} satisfies Record<string, WorkingGroup>;