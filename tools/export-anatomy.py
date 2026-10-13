import bpy,bmesh,json,math,os
from mathutils import Vector
from pathlib import Path
output=str(Path(__file__).resolve().parents[1] / 'public/assets/anatomy/torso.glb')
scene=bpy.context.scene; deps=bpy.context.evaluated_depsgraph_get()
export_collection=bpy.data.collections.new('Javim torso');scene.collection.children.link(export_collection)
selected=[];manifest=[]
heart_names={'Left atrium','Right atrium','Left ventricle','Right ventricle','Pulmonary trunk'}
def bounds(obj):
 corners=[obj.matrix_world@Vector(v) for v in obj.bound_box]
 return [min(v[i] for v in corners) for i in range(3)],[max(v[i] for v in corners) for i in range(3)]
for obj in list(bpy.data.objects):
 n=obj.name.lower(); cs=[c.name for c in obj.users_collection]
 if n.endswith(('.j','.i')) or obj.type not in ['MESH','CURVE']:continue
 group=None
 if obj.name in heart_names:group='blood'
 elif obj.name=='Thyroid gland':group='thyroid'
 elif obj.name=='Liver':group='liver'
 elif obj.name=='Pancreas':group='metabolic'
 elif '1: Skeletal system' in cs and any(k in n for k in ['rib.','sternum','clavicle','thoracic vertebra','cervical vertebra']):group='bones'
 elif '5: Cardiovascular system' in cs and any(k in n for k in ['arter','aorta','vena cava','pulmonary vein','coronary sinus']):group='vessels'
 if not group:continue
 lo,hi=bounds(obj)
 if hi[2]<1.0 or lo[2]>1.51 or lo[0]>.24 or hi[0]<-.24:continue
 try:
  mesh=bpy.data.meshes.new_from_object(obj.evaluated_get(deps),depsgraph=deps)
 except Exception:continue
 if len(mesh.vertices)<4:bpy.data.meshes.remove(mesh);continue
 mesh.transform(obj.matrix_world)
 bm=bmesh.new();bm.from_mesh(mesh)
 for plane_co,plane_no in [((0,0,1.0),(0,0,-1)),((0,0,1.51),(0,0,1)),((-.24,0,0),(-1,0,0)),((.24,0,0),(1,0,0))]:
  bmesh.ops.bisect_plane(bm,geom=list(bm.verts)+list(bm.edges)+list(bm.faces),dist=.00001,plane_co=plane_co,plane_no=plane_no,clear_outer=True)
 bm.to_mesh(mesh);bm.free();mesh.update()
 if len(mesh.polygons)==0:bpy.data.meshes.remove(mesh);continue
 new=bpy.data.objects.new(obj.name,mesh);export_collection.objects.link(new)
 new['system']=group;mesh.materials.clear()
 for p in mesh.polygons:p.use_smooth=True
 if group in ['blood','thyroid','liver','metabolic']:
  mod=new.modifiers.new('Surface smoothing','SUBSURF');mod.levels=1;mod.render_levels=1
 elif len(mesh.polygons)>18000:
  mod=new.modifiers.new('Web reduction','DECIMATE');mod.ratio=18000/len(mesh.polygons)
 selected.append(new);manifest.append({'name':obj.name,'system':group,'source':'Z-Anatomy / BodyParts3D'})
# The atlas lists a noncommercial kidney contributor. Those kidney meshes are
# deliberately excluded. These two bean-shaped meshes are newly authored here.
for side,centre in [('left',(.061,.018,1.11)),('right',(-.059,.01,1.094))]:
 bpy.ops.mesh.primitive_uv_sphere_add(segments=40,ring_count=28,location=centre)
 obj=bpy.context.object;obj.name='Original illustrative kidney '+side
 for vertex in obj.data.vertices:
  x,y,z=vertex.co
  indent=math.exp(-((z/.38)**2+(y/.65)**2))*.42
  if side=='left':x-=indent*(max(0,-x)**2)
  else:x+=indent*(max(0,x)**2)
  vertex.co=(x*.03,y*.022,z*.052)
 for c in list(obj.users_collection):c.objects.unlink(obj)
 export_collection.objects.link(obj);obj['system']='kidneys'
 for p in obj.data.polygons:p.use_smooth=True
 selected.append(obj);manifest.append({'name':obj.name,'system':'kidneys','source':'Original simplified kidney geometry; not sourced from atlas kidney models'})
for obj in scene.objects:
 obj.select_set(False)
for obj in selected:
 obj.hide_set(False);obj.hide_viewport=False;obj.hide_render=False;obj.select_set(True)
bpy.context.view_layer.objects.active=selected[0]
bpy.ops.export_scene.gltf(filepath=output,export_format='GLB',use_selection=True,export_apply=True,export_materials='NONE',export_extras=True,export_animations=False,export_cameras=False,export_lights=False)
open(output.replace('.glb','-manifest.json'),'w').write(json.dumps(manifest,indent=2))
print('EXPORTED',len(selected),'models',os.path.getsize(output),'bytes')
